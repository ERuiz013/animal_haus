<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de preflight request de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if (strlen($q) < 3) {
    echo json_encode([]);
    exit;
}

try {
    // Buscar en la tabla de productos por nombre
    $stmt = $pdo->prepare("SELECT p.*, COALESCE(SUM(e.cantidad_actual), 0) AS stock 
                           FROM productos p 
                           LEFT JOIN existencias e ON p.id = e.producto_id 
                           WHERE p.estado = 1 AND p.nombre LIKE :q 
                           GROUP BY p.id 
                           ORDER BY p.nombre ASC LIMIT 15");
    $stmt->execute(['q' => '%' . $q . '%']);
    $productos = $stmt->fetchAll();
    echo json_encode($productos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
