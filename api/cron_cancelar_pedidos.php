<?php
// api/cron_cancelar_pedidos.php
// Este script debe ser ejecutado mediante una Tarea Cron cada 5 o 10 minutos.

require_once 'db.php';

try {
    $pdo->beginTransaction();

    // 1. Buscar todos los pedidos en estado 'pendiente_pago' cuya fecha de creación haya superado los 20 minutos
    $stmtSelect = $pdo->prepare("
        SELECT id 
        FROM ventas 
        WHERE estado = 'pendiente_pago' 
        AND fecha <= DATE_SUB(NOW(), INTERVAL 20 MINUTE)
    ");
    $stmtSelect->execute();
    $ventasCanceladas = $stmtSelect->fetchAll(PDO::FETCH_ASSOC);

    if (count($ventasCanceladas) > 0) {
        $stmtDetalles = $pdo->prepare("SELECT producto_id, cantidad FROM ventas_detalles WHERE venta_id = ?");
        $stmtUpdateStock = $pdo->prepare("UPDATE existencias SET cantidad_actual = cantidad_actual + ? WHERE producto_id = ?");
        $stmtUpdateVenta = $pdo->prepare("UPDATE ventas SET estado = 'cancelado' WHERE id = ?");

        $count = 0;
        foreach ($ventasCanceladas as $venta) {
            $venta_id = $venta['id'];

            // a. Obtener los detalles (productos) de esta venta
            $stmtDetalles->execute([$venta_id]);
            $detalles = $stmtDetalles->fetchAll(PDO::FETCH_ASSOC);

            // b. Devolver la cantidad al inventario (existencias)
            foreach ($detalles as $item) {
                // Si el producto_id es 9999 (Delivery), no actualizamos stock
                if ($item['producto_id'] != 9999) {
                    $stmtUpdateStock->execute([$item['cantidad'], $item['producto_id']]);
                }
            }

            // c. Marcar la venta como cancelada
            $stmtUpdateVenta->execute([$venta_id]);
            $count++;
        }
        
        $pdo->commit();
        echo json_encode(["status" => "success", "message" => "$count pedidos cancelados y stock restaurado."]);
    } else {
        $pdo->commit();
        echo json_encode(["status" => "success", "message" => "No hay pedidos pendientes expirados."]);
    }

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
