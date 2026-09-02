<?php
// api/register.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de preflight request de CORS (cuando React envía OPTIONS antes de POST)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

// Leer datos enviados en formato JSON
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email, $data->password, $data->nombre, $data->apellido, $data->telefono, $data->documento)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos. Por favor llene todos los campos requeridos.']);
    exit;
}

$email = filter_var(trim($data->email), FILTER_SANITIZE_EMAIL);
$password = $data->password;
$nombre = htmlspecialchars(trim($data->nombre));
$apellido = htmlspecialchars(trim($data->apellido));
$telefono = htmlspecialchars(trim($data->telefono));
$documento = htmlspecialchars(trim($data->documento));
$rol = 2; // Rol 2 por defecto

// Verificar si el correo ya está registrado
$stmt = $pdo->prepare("SELECT uuid FROM usuarios WHERE email = ? LIMIT 1");
$stmt->execute([$email]);

if ($stmt->fetch()) {
    // El correo ya existe
    http_response_code(409);
    echo json_encode(['error' => 'El correo electrónico ya tiene una cuenta registrada en nuestro sistema.']);
    exit;
}

// Función simple para generar UUID v4
function generate_uuid() {
    return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
        mt_rand( 0, 0xffff ),
        mt_rand( 0, 0x0fff ) | 0x4000,
        mt_rand( 0, 0x3fff ) | 0x8000,
        mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
    );
}

$uuid = generate_uuid();
$password_hash = password_hash($password, PASSWORD_BCRYPT);
$now = date('Y-m-d H:i:s');

try {
    $insertStmt = $pdo->prepare("INSERT INTO usuarios (uuid, email, password_hash, nombre, apellido, telefono, documento, rol, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)");
    $insertStmt->execute([$uuid, $email, $password_hash, $nombre, $apellido, $telefono, $documento, $rol, $now, $now]);
    
    http_response_code(201);
    echo json_encode([
        'message' => 'Usuario registrado exitosamente', 
        'user' => [
            'uuid' => $uuid,
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => $email,
            'rol' => $rol
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error al registrar el usuario.', 'details' => $e->getMessage()]);
}
