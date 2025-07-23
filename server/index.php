<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string and decode URI
$path = parse_url($request_uri, PHP_URL_PATH);
$path = urldecode($path);

// Remove base path if running in subdirectory
$base_path = '/';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Mock data
$mockUsers = [
    ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com', 'role' => 'user'],
    ['id' => 2, 'name' => 'Admin User', 'email' => 'admin@example.com', 'role' => 'admin'],
    ['id' => 3, 'name' => 'Finance Manager', 'email' => 'finance@example.com', 'role' => 'staff_finance'],
    ['id' => 4, 'name' => 'PA Staff', 'email' => 'pa@example.com', 'role' => 'staff_pa'],
    ['id' => 5, 'name' => 'MMK Staff', 'email' => 'mmk@example.com', 'role' => 'staff_mmk']
];

$mockPrograms = [
    [
        'id' => 1,
        'name' => 'Community Development Program',
        'budget' => 50000,
        'recipientName' => 'Community Center',
        'status' => 'approved',
        'created_by' => 1,
        'created_at' => '2024-01-15T10:00:00Z',
        'updated_at' => '2024-01-20T14:30:00Z'
    ],
    [
        'id' => 2,
        'name' => 'Youth Education Initiative',
        'budget' => 25000,
        'recipientName' => 'Local School',
        'status' => 'pending',
        'created_by' => 1,
        'created_at' => '2024-01-18T09:15:00Z',
        'updated_at' => '2024-01-18T09:15:00Z'
    ],
    [
        'id' => 3,
        'name' => 'Healthcare Support Program',
        'budget' => 75000,
        'recipientName' => 'Medical Clinic',
        'status' => 'under_review',
        'created_by' => 2,
        'created_at' => '2024-01-20T11:45:00Z',
        'updated_at' => '2024-01-22T16:20:00Z'
    ],
    [
        'id' => 4,
        'name' => 'Environmental Conservation',
        'budget' => 30000,
        'recipientName' => 'Green Foundation',
        'status' => 'approved',
        'created_by' => 1,
        'created_at' => '2024-01-25T08:30:00Z',
        'updated_at' => '2024-01-28T12:15:00Z'
    ],
    [
        'id' => 5,
        'name' => 'Senior Care Program',
        'budget' => 40000,
        'recipientName' => 'Elder Care Center',
        'status' => 'rejected',
        'created_by' => 3,
        'created_at' => '2024-02-01T14:20:00Z',
        'updated_at' => '2024-02-05T09:45:00Z'
    ],
    [
        'id' => 6,
        'name' => 'Technology Training',
        'budget' => 35000,
        'recipientName' => 'Tech Institute',
        'status' => 'draft',
        'created_by' => 1,
        'created_at' => '2024-02-10T16:00:00Z',
        'updated_at' => '2024-02-10T16:00:00Z'
    ]
];

try {
    // Health check
    if ($path === 'health' && $request_method === 'GET') {
        echo json_encode([
            'status' => 'OK',
            'timestamp' => date('c'),
            'environment' => 'development'
        ]);
        exit();
    }

    // Authentication routes
    if ($path === 'api/auth/login' && $request_method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Mock login - find user by email
        $user = null;
        foreach ($mockUsers as $u) {
            if ($u['email'] === $input['email']) {
                $user = $u;
                break;
            }
        }
        
        if ($user && $input['password'] === 'password') {
            echo json_encode([
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'token' => 'mock-token-' . $user['id']
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        exit();
    }

    // User routes
    if ($path === 'api/users/current' && $request_method === 'GET') {
        echo json_encode($mockUsers[0]); // Return first user as current
        exit();
    }

    if ($path === 'api/users' && $request_method === 'GET') {
        echo json_encode($mockUsers);
        exit();
    }

    if ($path === 'api/users' && $request_method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $newUser = [
            'id' => count($mockUsers) + 1,
            'name' => $input['name'],
            'email' => $input['email'],
            'role' => $input['role'] ?? 'user'
        ];
        echo json_encode($newUser);
        exit();
    }

    // Program routes
    if ($path === 'api/programs' && $request_method === 'GET') {
        echo json_encode($mockPrograms);
        exit();
    }

    if ($path === 'api/programs' && $request_method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $newProgram = [
            'id' => count($mockPrograms) + 1,
            'name' => $input['name'],
            'budget' => floatval($input['budget']),
            'recipientName' => $input['recipientName'],
            'status' => 'draft',
            'created_by' => 1,
            'created_at' => date('c'),
            'updated_at' => date('c')
        ];
        echo json_encode($newProgram);
        exit();
    }

    // Statistics endpoint
    if ($path === 'api/statistics' && $request_method === 'GET') {
        $stats = [
            'totalPrograms' => count($mockPrograms),
            'approvedPrograms' => count(array_filter($mockPrograms, fn($p) => $p['status'] === 'approved')),
            'pendingPrograms' => count(array_filter($mockPrograms, fn($p) => $p['status'] === 'pending')),
            'rejectedPrograms' => count(array_filter($mockPrograms, fn($p) => $p['status'] === 'rejected')),
            'totalBudget' => array_sum(array_column($mockPrograms, 'budget')),
            'totalUsers' => count($mockUsers)
        ];
        echo json_encode($stats);
        exit();
    }

    // 404 Not Found
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>