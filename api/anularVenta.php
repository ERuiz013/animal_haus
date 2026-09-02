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
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el ID de la venta.']);
        exit;
    }

    $id = (int)$data['id'];

    $pdo->beginTransaction();

    // 1. Obtener detalles para reponer stock
    $stmtDetalles = $pdo->prepare("SELECT producto_id, cantidad FROM ventas_detalles WHERE venta_id = ?");
    $stmtDetalles->execute([$id]);
    $detalles = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);

    // 2. Reponer stock
    $stmtUpdateStock = $pdo->prepare("UPDATE productos SET stock = stock + ? WHERE id = ?");
    foreach ($detalles as $detalle) {
        $stmtUpdateStock->execute([$detalle['cantidad'], $detalle['producto_id']]);
    }

    // 3. Cambiar estado de la venta
    $stmtEstado = $pdo->prepare("UPDATE ventas SET estado = 'anulado' WHERE id = ?");
    $stmtEstado->execute([$id]);

    $pdo->commit();

    echo json_encode(['message' => 'Venta anulada con éxito y stock repuesto.']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error al anular la venta.', 'details' => $e->getMessage()]);
}
