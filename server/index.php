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

require_once 'config/database.php';
require_once 'middleware/auth.php';
require_once 'controllers/AuthController.php';
require_once 'controllers/UserController.php';
require_once 'controllers/ProgramController.php';

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

// Route the request
try {
    // Health check
    if ($path === 'health' && $request_method === 'GET') {
        echo json_encode([
            'status' => 'OK',
            'timestamp' => date('c'),
            'environment' => 'production'
        ]);
        exit();
    }

    // Authentication routes
    if ($path === 'api/auth/login' && $request_method === 'POST') {
        $controller = new AuthController();
        $controller->login();
        exit();
    }

    // User routes
    if ($path === 'api/users/current' && $request_method === 'GET') {
        requireAuth();
        $controller = new UserController();
        $controller->getCurrentUser();
        exit();
    }

    if ($path === 'api/users' && $request_method === 'GET') {
        requireAuth();
        $controller = new UserController();
        $controller->getUsers();
        exit();
    }

    if ($path === 'api/users' && $request_method === 'POST') {
        requireAuth();
        $controller = new UserController();
        $controller->createUser();
        exit();
    }

    if (preg_match('/^api\/users\/(\d+)$/', $path, $matches) && $request_method === 'PUT') {
        requireAuth();
        $controller = new UserController();
        $controller->updateUser($matches[1]);
        exit();
    }

    if (preg_match('/^api\/users\/(\d+)$/', $path, $matches) && $request_method === 'DELETE') {
        requireAuth();
        $controller = new UserController();
        $controller->deleteUser($matches[1]);
        exit();
    }

    // Program routes
    if ($path === 'api/programs' && $request_method === 'GET') {
        requireAuth();
        $controller = new ProgramController();
        $controller->getPrograms();
        exit();
    }

    if ($path === 'api/programs' && $request_method === 'POST') {
        requireAuth();
        $controller = new ProgramController();
        $controller->createProgram();
        exit();
    }

    if (preg_match('/^api\/programs\/(\d+)$/', $path, $matches) && $request_method === 'PUT') {
        requireAuth();
        $controller = new ProgramController();
        $controller->updateProgram($matches[1]);
        exit();
    }

    if (preg_match('/^api\/programs\/(\d+)$/', $path, $matches) && $request_method === 'DELETE') {
        requireAuth();
        $controller = new ProgramController();
        $controller->deleteProgram($matches[1]);
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