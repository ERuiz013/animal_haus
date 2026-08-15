<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
require 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM empresa ORDER BY id DESC");
    $empresas = $stmt->fetchAll();
    echo json_encode($empresas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
