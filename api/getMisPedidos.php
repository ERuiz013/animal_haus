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

if (!isset($_GET['cliente_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id del cliente.']);
    exit;
}

$cliente_param = $_GET['cliente_id'];

try {
    // Get Ventas for this cliente (soportando tanto el ID numérico como el UUID alfanumérico)
    $stmt = $pdo->prepare("
        SELECT v.* 
        FROM ventas v
        JOIN usuarios u ON v.cliente_id = u.id
        WHERE u.id = ? OR u.uuid = ?
        ORDER BY v.fecha DESC
    ");
    $stmt->execute([$cliente_param, $cliente_param]);
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($ventas) > 0) {
        // Obtenemos todos los IDs de las ventas
        $ventaIds = array_column($ventas, 'id');
        $inQuery = implode(',', array_fill(0, count($ventaIds), '?'));
        
        $stmtDetalles = $pdo->prepare("
            SELECT 
                vd.*,
                p.nombre as producto_nombre,
                p.imagen as producto_imagen
            FROM ventas_detalles vd
            LEFT JOIN productos p ON vd.producto_id = p.id
            WHERE vd.venta_id IN ($inQuery)
        ");
        $stmtDetalles->execute($ventaIds);
        $allDetalles = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);
        
        // Agrupamos los detalles por venta_id en PHP
        $detallesGrouped = [];
        foreach ($allDetalles as $detalle) {
            $detallesGrouped[$detalle['venta_id']][] = $detalle;
        }
        
        foreach ($ventas as &$venta) {
            $venta['detalles'] = $detallesGrouped[$venta['id']] ?? [];
        }
    }

    echo json_encode($ventas);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
?>
