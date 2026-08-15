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

if (!$data || !isset($data->id) || !isset($data->nombre) || !isset($data->simbolo)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos.']);
    exit;
}

$id = $data->id;
$nombre = $data->nombre;
$simbolo = $data->simbolo;
$permitir_decimal = isset($data->permitir_decimal) && $data->permitir_decimal === 'S' ? 'S' : 'N';

try {
    $stmt = $pdo->prepare("UPDATE unidades_medidas SET nombre = ?, simbolo = ?, permitir_decimal = ? WHERE id = ?");
    $stmt->execute([$nombre, $simbolo, $permitir_decimal, $id]);

    echo json_encode(['message' => 'Unidad de medida actualizada correctamente']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
