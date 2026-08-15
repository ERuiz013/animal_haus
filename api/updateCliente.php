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

if (!$data || !isset($data->id) || !isset($data->nombre) || !isset($data->apellido) || !isset($data->email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos.']);
    exit;
}

$id = $data->id;
$nombre = $data->nombre;
$apellido = $data->apellido;
$email = $data->email;
$telefono = isset($data->telefono) ? $data->telefono : null;

try {
    $stmt = $pdo->prepare("UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ? AND rol = 'customer'");
    $stmt->execute([$nombre, $apellido, $email, $telefono, $id]);

    echo json_encode(['message' => 'Cliente actualizado correctamente']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
