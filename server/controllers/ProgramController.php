<?php
class ProgramController {
    
    public function getPrograms() {
        $current_user = $GLOBALS['current_user'];
        
        try {
            $db = getDB();
            
            if ($current_user['role'] === 'admin' || $current_user['role'] === 'staff_finance') {
                // Admin and finance can see all programs
                $stmt = $db->prepare("
                    SELECT p.*, u.name as creator_name 
                    FROM programs p 
                    LEFT JOIN users u ON p.created_by = u.id 
                    ORDER BY p.created_at DESC
                ");
                $stmt->execute();
            } else {
                // Regular users can only see their own programs
                $stmt = $db->prepare("
                    SELECT p.*, u.name as creator_name 
                    FROM programs p 
                    LEFT JOIN users u ON p.created_by = u.id 
                    WHERE p.created_by = ? 
                    ORDER BY p.created_at DESC
                ");
                $stmt->execute([$current_user['id']]);
            }
            
            $programs = $stmt->fetchAll();
            
            // Convert budget to float
            foreach ($programs as &$program) {
                $program['budget'] = floatval($program['budget']);
            }
            
            echo json_encode($programs);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch programs: ' . $e->getMessage()]);
        }
    }
    
    public function createProgram() {
        $current_user = $GLOBALS['current_user'];
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['budget']) || !isset($input['recipientName'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, budget, and recipient name are required']);
            return;
        }
        
        try {
            $db = getDB();
            
            $stmt = $db->prepare("
                INSERT INTO programs (name, budget, recipient_name, status, created_by, created_at, updated_at) 
                VALUES (?, ?, ?, 'draft', ?, NOW(), NOW())
            ");
            $stmt->execute([
                $input['name'],
                floatval($input['budget']),
                $input['recipientName'],
                $current_user['id']
            ]);
            
            $programId = $db->lastInsertId();
            
            // Return created program
            $stmt = $db->prepare("
                SELECT p.*, u.name as creator_name 
                FROM programs p 
                LEFT JOIN users u ON p.created_by = u.id 
                WHERE p.id = ?
            ");
            $stmt->execute([$programId]);
            $program = $stmt->fetch();
            
            $program['budget'] = floatval($program['budget']);
            
            echo json_encode($program);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create program: ' . $e->getMessage()]);
        }
    }
    
    public function updateProgram($programId) {
        $current_user = $GLOBALS['current_user'];
        $input = json_decode(file_get_contents('php://input'), true);
        
        try {
            $db = getDB();
            
            // Check if program exists and user has permission
            $stmt = $db->prepare("SELECT created_by FROM programs WHERE id = ?");
            $stmt->execute([$programId]);
            $program = $stmt->fetch();
            
            if (!$program) {
                http_response_code(404);
                echo json_encode(['error' => 'Program not found']);
                return;
            }
            
            // Only creator or admin can update
            if ($program['created_by'] != $current_user['id'] && $current_user['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Access denied']);
                return;
            }
            
            // Update program
            $stmt = $db->prepare("
                UPDATE programs 
                SET name = ?, budget = ?, recipient_name = ?, updated_at = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([
                $input['name'] ?? '',
                floatval($input['budget'] ?? 0),
                $input['recipientName'] ?? '',
                $programId
            ]);
            
            // Return updated program
            $stmt = $db->prepare("
                SELECT p.*, u.name as creator_name 
                FROM programs p 
                LEFT JOIN users u ON p.created_by = u.id 
                WHERE p.id = ?
            ");
            $stmt->execute([$programId]);
            $program = $stmt->fetch();
            
            $program['budget'] = floatval($program['budget']);
            
            echo json_encode($program);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update program: ' . $e->getMessage()]);
        }
    }
    
    public function deleteProgram($programId) {
        $current_user = $GLOBALS['current_user'];
        
        try {
            $db = getDB();
            
            // Check if program exists and user has permission
            $stmt = $db->prepare("SELECT created_by FROM programs WHERE id = ?");
            $stmt->execute([$programId]);
            $program = $stmt->fetch();
            
            if (!$program) {
                http_response_code(404);
                echo json_encode(['error' => 'Program not found']);
                return;
            }
            
            // Only creator or admin can delete
            if ($program['created_by'] != $current_user['id'] && $current_user['role'] !== 'admin') {
                http_response_code(403);
                echo json_encode(['error' => 'Access denied']);
                return;
            }
            
            // Delete program
            $stmt = $db->prepare("DELETE FROM programs WHERE id = ?");
            $stmt->execute([$programId]);
            
            echo json_encode(['message' => 'Program deleted successfully']);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete program: ' . $e->getMessage()]);
        }
    }
}
?>