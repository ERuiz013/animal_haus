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
    $id = $data['id'] ?? '';

    if (empty($id)) {
        echo json_encode(['error' => 'ID es requerido.']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE animales SET estado = 0 WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['message' => 'Animal anulado exitosamente.']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
