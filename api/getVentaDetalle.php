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

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el id de la venta.']);
    exit;
}

$id = (int)$_GET['id'];

try {
    // 1. Get Venta info with Cliente and Talonario
    $stmt = $pdo->prepare("
        SELECT 
            v.*, 
            u.nombre as cliente_nombre, 
            u.apellido as cliente_apellido,
            u.documento as cliente_documento,
            t.nro_timbrado,
            t.fecha_fin as talonario_fecha_fin,
            t.fecha_inicio as talonario_fecha_inicio,
            tal.establecimiento,
            tal.punto_expedicion,
            tal.numero_actual,
            tal.tipo_comprobante
        FROM ventas v
        LEFT JOIN usuarios u ON v.cliente_id = u.id
        LEFT JOIN talonarios tal ON v.talonario_id = tal.id
        LEFT JOIN timbrados t ON tal.timbrado_id = t.id
        WHERE v.id = ?
    ");
    $stmt->execute([$id]);
    $venta = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$venta) {
        http_response_code(404);
        echo json_encode(['error' => 'Venta no encontrada.']);
        exit;
    }

    // 2. Get Venta Detalles with Producto info
    $stmtDetalles = $pdo->prepare("
        SELECT 
            vd.*,
            p.nombre as producto_nombre
        FROM ventas_detalles vd
        LEFT JOIN productos p ON vd.producto_id = p.id
        WHERE vd.venta_id = ?
    ");
    $stmtDetalles->execute([$id]);
    $detalles = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);

    $venta['detalles'] = $detalles;

    echo json_encode($venta);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
?>
