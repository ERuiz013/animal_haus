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
    $q = isset($_GET['q']) ? $_GET['q'] : null;
    $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : null;
    $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : null;
    
    $query = "SELECT 
                p.id, p.sku, p.nombre, p.uni_med_id, p.categoria_id,
                SUM(vd.cantidad) AS cantidad_vendida, 
                SUM(vd.subtotal) AS total_recaudado
              FROM ventas_detalles vd
              JOIN ventas v ON vd.venta_id = v.id
              JOIN productos p ON vd.producto_id = p.id
              WHERE v.estado = 'confirmado'";

    $params = [];

    if ($q) {
        $query .= " AND p.nombre LIKE ?";
        $params[] = "%$q%";
    }

    if ($fecha_inicio && $fecha_fin) {
        $query .= " AND DATE(v.fecha) BETWEEN ? AND ?";
        $params[] = $fecha_inicio;
        $params[] = $fecha_fin;
    }

    $query .= " GROUP BY p.id ORDER BY cantidad_vendida DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $productos = $stmt->fetchAll();
    echo json_encode($productos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
