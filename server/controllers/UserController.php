<?php
class UserController {
    
    public function getCurrentUser() {
        $user = $GLOBALS['current_user'];
        echo json_encode($user);
    }
    
    public function getUsers() {
        $current_user = $GLOBALS['current_user'];
        
        // Only admin can view all users
        if ($current_user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC");
            $stmt->execute();
            $users = $stmt->fetchAll();
            
            echo json_encode($users);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to fetch users: ' . $e->getMessage()]);
        }
    }
    
    public function createUser() {
        $current_user = $GLOBALS['current_user'];
        
        // Only admin can create users
        if ($current_user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        // Handle form data (including file upload)
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $role = $_POST['role'] ?? 'user';
        $excoLocation = $_POST['excoLocation'] ?? '';
        $contactNo = $_POST['contactNo'] ?? '';
        
        if (empty($name) || empty($email) || empty($password) || empty($contactNo)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, email, password, and contact number are required']);
            return;
        }
        
        try {
            $db = getDB();
            
            // Check if email already exists
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'Email already exists']);
                return;
            }
            
            // Hash password
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            
            // Handle file upload
            $picturePath = null;
            if (isset($_FILES['picture']) && $_FILES['picture']['error'] === UPLOAD_ERR_OK) {
                $uploadDir = 'uploads/profiles/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0755, true);
                }
                
                $fileExtension = pathinfo($_FILES['picture']['name'], PATHINFO_EXTENSION);
                $fileName = uniqid() . '.' . $fileExtension;
                $picturePath = $uploadDir . $fileName;
                
                if (!move_uploaded_file($_FILES['picture']['tmp_name'], $picturePath)) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to upload picture']);
                    return;
                }
            }
            
            // Insert user
            $stmt = $db->prepare("
                INSERT INTO users (name, email, password, role, created_at) 
                VALUES (?, ?, ?, ?, NOW())
            ");
            $stmt->execute([$name, $email, $hashedPassword, $role]);
            
            $userId = $db->lastInsertId();
            
            // Return created user (without password)
            $stmt = $db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            echo json_encode($user);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create user: ' . $e->getMessage()]);
        }
    }
    
    public function updateUser($userId) {
        $current_user = $GLOBALS['current_user'];
        
        // Only admin can update users
        if ($current_user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and email are required']);
            return;
        }
        
        try {
            $db = getDB();
            
            // Check if user exists
            $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                return;
            }
            
            // Check if email is taken by another user
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->execute([$input['email'], $userId]);
            if ($stmt->fetch()) {
                http_response_code(400);
                echo json_encode(['error' => 'Email already exists']);
                return;
            }
            
            // Update user
            if (!empty($input['password'])) {
                // Update with new password
                $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
                $stmt = $db->prepare("
                    UPDATE users 
                    SET name = ?, email = ?, password = ?, role = ?, updated_at = NOW() 
                    WHERE id = ?
                ");
                $stmt->execute([
                    $input['name'], 
                    $input['email'], 
                    $hashedPassword, 
                    $input['role'] ?? 'user', 
                    $userId
                ]);
            } else {
                // Update without changing password
                $stmt = $db->prepare("
                    UPDATE users 
                    SET name = ?, email = ?, role = ?, updated_at = NOW() 
                    WHERE id = ?
                ");
                $stmt->execute([
                    $input['name'], 
                    $input['email'], 
                    $input['role'] ?? 'user', 
                    $userId
                ]);
            }
            
            // Return updated user
            $stmt = $db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            
            echo json_encode($user);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update user: ' . $e->getMessage()]);
        }
    }
    
    public function deleteUser($userId) {
        $current_user = $GLOBALS['current_user'];
        
        // Only admin can delete users
        if ($current_user['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Access denied']);
            return;
        }
        
        // Prevent admin from deleting themselves
        if ($current_user['id'] == $userId) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot delete your own account']);
            return;
        }
        
        try {
            $db = getDB();
            
            // Check if user exists
            $stmt = $db->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                return;
            }
            
            // Delete user
            $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            
            echo json_encode(['message' => 'User deleted successfully']);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete user: ' . $e->getMessage()]);
        }
    }
}
?>