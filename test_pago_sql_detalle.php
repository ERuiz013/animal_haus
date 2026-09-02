<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';

try {
    $pdo->beginTransaction();

    $stmtDetalle = $pdo->prepare("
        INSERT INTO ventas_detalles (
            venta_id, producto_id, cantidad, precio_unitario, porcentaje_impuesto, monto_impuesto, subtotal
        ) VALUES (?, ?, ?, ?, 10, ?, ?)
    ");
    
    // Descontamos stock temporalmente (si se anula se repone)
    $stmtUpdateStock = $pdo->prepare("UPDATE productos SET stock = stock - ? WHERE id = ?");

    // Insert dummy venta first
    $pdo->exec("INSERT INTO ventas (cliente_id, nro_factura, condicion_venta, estado) VALUES (1, '000', 1, 'pendiente')");
    $venta_id = $pdo->lastInsertId();

    $stmtDetalle->execute([
        $venta_id, 1, 1, 10000, 909, 10000
    ]);
    
    $stmtUpdateStock->execute([1, 1]);

    echo "Success Detalle";
    $pdo->rollBack();
} catch (Exception $e) {
    echo "Error Detalle: " . $e->getMessage();
}
?>
