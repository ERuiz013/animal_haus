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

try {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el ID de la venta.']);
        exit;
    }

    $id = (int)$data['id'];
    $estado = isset($data['estado']) ? $data['estado'] : 'entregado';

    $stmt = $pdo->prepare("UPDATE ventas SET estado = ? WHERE id = ?");
    $stmt->execute([$estado, $id]);

    echo json_encode(['message' => 'Estado actualizado con éxito.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
