<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';

try {
    $pdo->beginTransaction();

    $stmtTal = $pdo->prepare("SELECT id, establecimiento, punto_expedicion, numero_actual FROM talonarios ORDER BY id ASC LIMIT 1 FOR UPDATE");
    $stmtTal->execute();
    $talonario = $stmtTal->fetch();

    if (!$talonario) {
        // Insert a dummy talonario for testing
        $pdo->exec("INSERT INTO talonarios (establecimiento, punto_expedicion, numero_actual) VALUES (1, 1, 1)");
        $talonario = ['id' => $pdo->lastInsertId(), 'establecimiento' => 1, 'punto_expedicion' => 1, 'numero_actual' => 1];
    }
    
    $nro_factura = "001-001-0000001";
    $deliveryMethod = "delivery";
    $deliveryCity = "Asuncion";
    $deliveryPrice = 15000;
    
    $total_exenta = 0;
    $gravada_10 = 10000;
    $total_iva_10 = 909;
    $total = 10000;

    $stmtVenta = $pdo->prepare("
        INSERT INTO ventas (
            cliente_id, talonario_id, nro_factura, condicion_venta, fecha, estado, metodo_cobro, 
            direccion_envio, costo_envio, total_exenta, gravada_5, gravada_10, gravada_30, 
            total_iva_5, total_iva_10, total_iva_30, liquidacion_iva, total
        ) VALUES (
            ?, ?, ?, 1, NOW(), 'pendiente_pago', 'pagopar', ?, ?, ?, 0, ?, 0, 0, ?, 0, ?, ?
        )
    ");

    $stmtVenta->execute([
        1, // cliente_id
        $talonario['id'],
        $nro_factura,
        $deliveryCity,
        $deliveryPrice,
        $total_exenta,
        $gravada_10,
        $total_iva_10,
        $total_iva_10,
        $total
    ]);
    
    echo "Success";
    $pdo->rollBack();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
