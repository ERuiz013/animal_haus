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

if (!$data || !isset($data->id) || !isset($data->nro_timbrado) || !isset($data->fecha_inicio) || !isset($data->fecha_fin)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos.']);
    exit;
}

$id = $data->id;
$nro_timbrado = $data->nro_timbrado;
$fecha_inicio = $data->fecha_inicio;
$fecha_fin = $data->fecha_fin;

try {
    $stmt = $pdo->prepare("UPDATE timbrados SET nro_timbrado = ?, fecha_inicio = ?, fecha_fin = ? WHERE id = ?");
    $stmt->execute([$nro_timbrado, $fecha_inicio, $fecha_fin, $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['message' => 'Timbrado actualizado correctamente']);
    } else {
        echo json_encode(['message' => 'No se realizaron cambios o el timbrado no existe']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
