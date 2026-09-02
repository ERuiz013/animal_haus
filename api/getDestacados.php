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

try {
    // 1. Intentar obtener los productos más vendidos desde ventas_detalles
    $queryVentas = "
        SELECT p.*, COUNT(vd.producto_id) as sales_count, COALESCE(SUM(e.cantidad_actual), 0) AS stock 
        FROM productos p
        JOIN ventas_detalles vd ON p.id = vd.producto_id
        LEFT JOIN existencias e ON p.id = e.producto_id
        WHERE p.estado = 1
        GROUP BY p.id
        ORDER BY sales_count DESC
        LIMIT 8
    ";
    
    $stmtVentas = $pdo->query($queryVentas);
    $productos = $stmtVentas->fetchAll(PDO::FETCH_ASSOC);

    // 2. Si no hay registros en ventas_detalles, buscar 4 productos cualesquiera
    if (count($productos) === 0) {
        $queryFallback = "
            SELECT p.*, COALESCE(SUM(e.cantidad_actual), 0) AS stock 
            FROM productos p 
            LEFT JOIN existencias e ON p.id = e.producto_id
            WHERE p.estado = 1 
            GROUP BY p.id
            ORDER BY p.id DESC 
            LIMIT 8
        ";
        $stmtFallback = $pdo->query($queryFallback);
        $productos = $stmtFallback->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($productos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
