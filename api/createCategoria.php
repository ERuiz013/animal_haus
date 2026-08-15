<?php
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

if (!$data || !isset($data->nombre)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos (nombre).']);
    exit;
}

$nombre = $data->nombre;
$descripcion = isset($data->descripcion) ? $data->descripcion : '';
$parent_id = (isset($data->parent_id) && $data->parent_id !== '') ? $data->parent_id : null;

try {
    $stmt = $pdo->prepare("INSERT INTO categorias (nombre, descripcion, parent_id) VALUES (?, ?, ?)");
    $stmt->execute([$nombre, $descripcion, $parent_id]);

    echo json_encode(['message' => 'Categoría creada correctamente', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
