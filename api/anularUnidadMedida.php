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

if (!$data || !isset($data->id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos.']);
    exit;
}

$id = $data->id;

try {
    $stmt = $pdo->prepare("UPDATE unidades_medidas SET estado = 0 WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['message' => 'Unidad de medida anulada correctamente']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
