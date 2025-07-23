<?php
function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization token required']);
        exit();
    }
    
    $token = $matches[1];
    $user = verifyToken($token);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit();
    }
    
    // Store user in global variable for controllers to access
    $GLOBALS['current_user'] = $user;
    return $user;
}

function verifyToken($token) {
    try {
        $secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key';
        
        // Simple JWT verification (in production, use a proper JWT library)
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        $header = json_decode(base64_decode($parts[0]), true);
        $payload = json_decode(base64_decode($parts[1]), true);
        $signature = $parts[2];
        
        // Verify signature
        $expected_signature = base64url_encode(hash_hmac('sha256', $parts[0] . '.' . $parts[1], $secret, true));
        
        if ($signature !== $expected_signature) {
            return false;
        }
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }
        
        // Get user from database
        $db = getDB();
        $stmt = $db->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
        $stmt->execute([$payload['user_id']]);
        return $stmt->fetch();
        
    } catch (Exception $e) {
        return false;
    }
}

function generateToken($user) {
    $secret = $_ENV['JWT_SECRET'] ?? 'your-secret-key';
    
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'user_id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]);
    
    $header_encoded = base64url_encode($header);
    $payload_encoded = base64url_encode($payload);
    
    $signature = base64url_encode(hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $secret, true));
    
    return $header_encoded . '.' . $payload_encoded . '.' . $signature;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}
?>