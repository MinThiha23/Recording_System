<?php
class AuthController {
    
    public function login() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['email']) || !isset($input['password'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password are required']);
            return;
        }
        
        try {
            $db = getDB();
            $stmt = $db->prepare("SELECT id, name, email, password, role FROM users WHERE email = ?");
            $stmt->execute([$input['email']]);
            $user = $stmt->fetch();
            
            if (!$user || !password_verify($input['password'], $user['password'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
                return;
            }
            
            // Remove password from response
            unset($user['password']);
            
            // Generate JWT token
            $token = generateToken($user);
            
            echo json_encode([
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'token' => $token
            ]);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Login failed: ' . $e->getMessage()]);
        }
    }
}
?>