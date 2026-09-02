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
    
    if (!isset($data['cliente_id']) || !isset($data['talonario_id']) || !isset($data['detalles']) || count($data['detalles']) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan datos requeridos para la venta o no hay productos.']);
        exit;
    }

    $pdo->beginTransaction();

    // 0. Obtener talonario y generar nro_factura asegurando que es el correcto en el momento de la venta
    $stmtTalonario = $pdo->prepare("SELECT establecimiento, punto_expedicion, numero_actual FROM talonarios WHERE id = ? FOR UPDATE");
    $stmtTalonario->execute([$data['talonario_id']]);
    $talonario = $stmtTalonario->fetch(PDO::FETCH_ASSOC);

    $nro_factura_generado = null;
    if ($talonario) {
        $nro_factura_generado = sprintf("%03d-%03d-%07d", $talonario['establecimiento'], $talonario['punto_expedicion'], $talonario['numero_actual']);
    }

    // 1. Insertar la venta
    $stmtVenta = $pdo->prepare("
        INSERT INTO ventas (
            cliente_id, talonario_id, nro_factura, condicion_venta, fecha, estado, metodo_cobro, 
            direccion_envio, costo_envio, total_exenta, gravada_5, gravada_10, gravada_30, 
            total_iva_5, total_iva_10, total_iva_30, liquidacion_iva, total
        ) VALUES (
            ?, ?, ?, ?, NOW(), 'pendiente_entrega', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    ");
    
    // Use the generated nro_factura or fallback to the one sent by frontend if needed (but prefer generated)
    $nro_factura = $nro_factura_generado ? $nro_factura_generado : (isset($data['nro_factura']) ? $data['nro_factura'] : null);
    $condicion_venta = isset($data['condicion_venta']) ? (int)$data['condicion_venta'] : 1;
    $metodo_cobro = isset($data['metodo_cobro']) ? $data['metodo_cobro'] : 'efectivo';
    $direccion_envio = isset($data['direccion_envio']) ? $data['direccion_envio'] : null;
    $costo_envio = isset($data['costo_envio']) ? (int)$data['costo_envio'] : 0;
    
    $total_exenta = isset($data['total_exenta']) ? $data['total_exenta'] : 0;
    $gravada_5 = isset($data['gravada_5']) ? $data['gravada_5'] : 0;
    $gravada_10 = isset($data['gravada_10']) ? $data['gravada_10'] : 0;
    $gravada_30 = isset($data['gravada_30']) ? $data['gravada_30'] : 0;
    $total_iva_5 = isset($data['total_iva_5']) ? $data['total_iva_5'] : 0;
    $total_iva_10 = isset($data['total_iva_10']) ? $data['total_iva_10'] : 0;
    $total_iva_30 = isset($data['total_iva_30']) ? $data['total_iva_30'] : 0;
    $liquidacion_iva = isset($data['liquidacion_iva']) ? $data['liquidacion_iva'] : 0;
    $total = isset($data['total']) ? (int)$data['total'] : 0;

    $stmtVenta->execute([
        $data['cliente_id'],
        $data['talonario_id'],
        $nro_factura,
        $condicion_venta,
        $metodo_cobro,
        $direccion_envio,
        $costo_envio,
        $total_exenta,
        $gravada_5,
        $gravada_10,
        $gravada_30,
        $total_iva_5,
        $total_iva_10,
        $total_iva_30,
        $liquidacion_iva,
        $total
    ]);

    $venta_id = $pdo->lastInsertId();

    // 1.5. Incrementar el número actual del talonario
    $stmtUpdateTalonario = $pdo->prepare("UPDATE talonarios SET numero_actual = numero_actual + 1 WHERE id = ?");
    $stmtUpdateTalonario->execute([$data['talonario_id']]);

    // 2. Insertar los detalles y descontar stock
    $stmtDetalle = $pdo->prepare("
        INSERT INTO ventas_detalles (
            venta_id, producto_id, cantidad, precio_unitario, porcentaje_impuesto, monto_impuesto, subtotal
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
        )
    ");

    $deposito_id = 1;
    $stmtUpdateStock = $pdo->prepare("UPDATE existencias SET cantidad_actual = cantidad_actual - ? WHERE producto_id = ? AND deposito_id = ?");

    foreach ($data['detalles'] as $detalle) {
        $stmtDetalle->execute([
            $venta_id,
            $detalle['producto_id'],
            $detalle['cantidad'],
            $detalle['precio_unitario'],
            $detalle['porcentaje_impuesto'],
            $detalle['monto_impuesto'],
            $detalle['subtotal']
        ]);

        // Descontar stock
        $stmtUpdateStock->execute([$detalle['cantidad'], $detalle['producto_id'], $deposito_id]);
    }

    $pdo->commit();

    echo json_encode([
        'message' => 'Venta registrada con éxito.', 
        'venta_id' => $venta_id,
        'nro_factura' => $nro_factura
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
