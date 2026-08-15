<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->nombre) || !isset($data->apellido) || !isset($data->email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos (nombre, apellido, email).']);
    exit;
}

$nombre = $data->nombre;
$apellido = $data->apellido;
$email = $data->email;
$telefono = isset($data->telefono) ? $data->telefono : null;

// UUID V4 equivalent
$uuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
    mt_rand(0, 0xffff), mt_rand(0, 0xffff),
    mt_rand(0, 0xffff),
    mt_rand(0, 0x0fff) | 0x4000,
    mt_rand(0, 0x3fff) | 0x8000,
    mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
);

$password_hash = password_hash('password123', PASSWORD_DEFAULT); // Default password for manual creation

try {
    $stmt = $pdo->prepare("INSERT INTO usuarios (uuid, email, password_hash, nombre, apellido, telefono, rol, is_active) VALUES (?, ?, ?, ?, ?, ?, 'customer', 1)");
    $stmt->execute([$uuid, $email, $password_hash, $nombre, $apellido, $telefono]);

    echo json_encode(['message' => 'Cliente creado correctamente', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
