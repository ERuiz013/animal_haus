<?php
// api/login.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de preflight request de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

// Leer datos enviados en formato JSON
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email, $data->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Por favor, ingrese correo y contraseña.']);
    exit;
}

$email = filter_var(trim($data->email), FILTER_SANITIZE_EMAIL);
$password = $data->password;

try {
    $stmt = $pdo->prepare("SELECT uuid, nombre, apellido, email, password_hash, is_active, rol FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'El correo electrónico ingresado no se encuentra registrado en nuestro sistema.']);
        exit;
    }

    if (!password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'La contraseña es incorrecta.']);
        exit;
    }

    if ($user['is_active'] == 0) {
        http_response_code(403);
        echo json_encode(['error' => 'Esta cuenta se encuentra desactivada.']);
        exit;
    }

    // Actualizar last_login_at
    $updateStmt = $pdo->prepare("UPDATE usuarios SET last_login_at = ? WHERE uuid = ?");
    $updateStmt->execute([date('Y-m-d H:i:s'), $user['uuid']]);

    echo json_encode([
        'message' => 'Login exitoso',
        'user' => [
            'uuid' => $user['uuid'],
            'nombre' => $user['nombre'],
            'apellido' => $user['apellido'],
            'email' => $user['email'],
            'rol' => $user['rol']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
