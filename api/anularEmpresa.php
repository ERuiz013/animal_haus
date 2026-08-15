<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
require 'db.php';

$data = json_decode(file_get_contents("php://input"));
if(empty($data->id)) {
    echo json_encode(['error' => 'ID requerido']);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM empresa WHERE id=?");
    $stmt->execute([$data->id]);
    echo json_encode(['message' => 'Empresa eliminada con éxito']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
