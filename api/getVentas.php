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
    $stmt = $pdo->query("
        SELECT 
            v.*, 
            u.nombre as cliente_nombre, 
            u.apellido as cliente_apellido
        FROM ventas v
        LEFT JOIN usuarios u ON v.cliente_id = u.id
        ORDER BY v.fecha DESC
    ");
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($ventas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
