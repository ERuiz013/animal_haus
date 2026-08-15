<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    // Solo clientes activos o no eliminados (depende de is_active)
    $stmt = $pdo->query("SELECT id, email, nombre, apellido, telefono, is_active FROM usuarios WHERE is_active = 1 AND rol = '2' ORDER BY nombre ASC");
    $clientes = $stmt->fetchAll();
    echo json_encode($clientes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
