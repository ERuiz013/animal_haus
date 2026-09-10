<?php
// api/iniciarPagoPagopar.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'pagopar_config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['uuid']) || empty($data['cartItems'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos para iniciar el pago.']);
    exit;
}

$uuid = $data['uuid'];
$cartItems = $data['cartItems'];
$deliveryMethod = $data['deliveryMethod'];
$deliveryPrice = isset($data['deliveryInfo']['price']) ? (int)$data['deliveryInfo']['price'] : 0;
$deliveryCity = isset($data['deliveryInfo']['city']) ? $data['deliveryInfo']['city'] : '';

// 1. Fetch user data
$stmt = $pdo->prepare("SELECT id, nombre, apellido, email, documento, telefono FROM usuarios WHERE uuid = ?");
$stmt->execute([$uuid]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

// 2. Fetch Talonario ID (solo para la referencia, el nro se consumirá en el webhook)
$stmtTal = $pdo->prepare("SELECT id FROM talonarios ORDER BY id ASC LIMIT 1");
$stmtTal->execute();
$talonario = $stmtTal->fetch();
$talonario_id = $talonario ? $talonario['id'] : 1; // Fallback a 1 si no hay

// 2.5 Fetch Empresa data for Pagopar
$stmtEmp = $pdo->query("SELECT * FROM empresa LIMIT 1");
$empresaData = $stmtEmp->fetch(PDO::FETCH_ASSOC);
$vendedor_direccion = ($empresaData && !empty($empresaData['direcion'])) ? $empresaData['direcion'] : "";
$vendedor_telefono = ($empresaData && !empty($empresaData['telefono'])) ? $empresaData['telefono'] : "";

// 3. Calculate Totals & Pagopar Details
$total = 0;
$total_exenta = 0;
$gravada_10 = 0;
$total_iva_10 = 0;
$detallesPagopar = [];

foreach ($cartItems as $item) {
    $subtotal = $item['precio'] * $item['quantity'];
    $total += $subtotal;
    $gravada_10 += $subtotal;
    $iva10 = round($subtotal / 11, 2);
    $total_iva_10 += $iva10;
    
    $detallesPagopar[] = [
        "id_producto" => $item['id'],
        "cantidad" => $item['quantity'],
        "nombre" => mb_substr($item['nombre'], 0, 100), // max 100 chars
        "precio_total" => $subtotal,
        "ciudad" => "1",
        "categoria" => "909",
        "public_key" => PAGOPAR_PUBLIC_TOKEN,
        "vendedor_direccion" => $vendedor_direccion,
        "vendedor_telefono" => $vendedor_telefono,
        "vendedor_direccion_referencia" => "",
        "vendedor_direccion_coordenadas" => "",
        "url_imagen" => "",
        "descripcion" => mb_substr($item['nombre'], 0, 200)
    ];
}

if ($deliveryMethod === 'delivery' && $deliveryPrice > 0) {
    $total += $deliveryPrice;
    $gravada_10 += $deliveryPrice;
    $iva10 = round($deliveryPrice / 11, 2);
    $total_iva_10 += $iva10;
    
    $detallesPagopar[] = [
        "id_producto" => 9999, // ID generico para el envio
        "cantidad" => 1,
        "nombre" => "Servicio de Delivery - " . mb_substr($deliveryCity, 0, 50),
        "precio_total" => $deliveryPrice,
        "ciudad" => "1",
        "categoria" => "909",
        "public_key" => PAGOPAR_PUBLIC_TOKEN,
        "vendedor_direccion" => $vendedor_direccion,
        "vendedor_telefono" => $vendedor_telefono,
        "vendedor_direccion_referencia" => "",
        "vendedor_direccion_coordenadas" => "",
        "url_imagen" => "",
        "descripcion" => "Servicio de Delivery - " . mb_substr($deliveryCity, 0, 50)
    ];
}

// 4. Iniciar transacción e insertar la venta en pendiente_pago
$pdo->beginTransaction();
try {
    $stmtVenta = $pdo->prepare("
        INSERT INTO ventas (
            cliente_id, talonario_id, nro_factura, condicion_venta, fecha, estado, metodo_cobro, 
            direccion_envio, costo_envio, total_exenta, gravada_5, gravada_10, gravada_30, 
            total_iva_5, total_iva_10, total_iva_30, liquidacion_iva, total
        ) VALUES (
            ?, ?, NULL, 1, NOW(), 'pendiente_pago', 'pagopar', ?, ?, ?, 0, ?, 0, 0, ?, 0, ?, ?
        )
    ");

    $stmtVenta->execute([
        $user['id'], // usamos el id del usuario que funciona como cliente
        $talonario_id,
        $deliveryMethod === 'delivery' ? $deliveryCity : null,
        $deliveryMethod === 'delivery' ? $deliveryPrice : 0,
        $total_exenta,
        $gravada_10,
        $total_iva_10,
        $total_iva_10,
        $total
    ]);

    $venta_id = $pdo->lastInsertId();

    // El talonario se incrementará en el webhook cuando se pague

    // Insertar Detalles
    $stmtDetalle = $pdo->prepare("
        INSERT INTO ventas_detalles (
            venta_id, producto_id, cantidad, precio_unitario, porcentaje_impuesto, monto_impuesto, subtotal
        ) VALUES (?, ?, ?, ?, 10, ?, ?)
    ");
    
    // Descontamos stock temporalmente (si se anula se repone)
    $stmtUpdateStock = $pdo->prepare("UPDATE existencias SET cantidad_actual = cantidad_actual - ? WHERE producto_id = ?");

    foreach ($cartItems as $item) {
        $subtotal = $item['precio'] * $item['quantity'];
        $stmtDetalle->execute([
            $venta_id, $item['id'], $item['quantity'], $item['precio'], round($subtotal/11, 2), $subtotal
        ]);
        $stmtUpdateStock->execute([$item['quantity'], $item['id']]);
    }
    
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error' => 'Error al registrar orden local', 'details' => $e->getMessage()]);
    exit;
}

// 5. Preparar Request a Pagopar
$hash_string = PAGOPAR_PRIVATE_TOKEN . $venta_id . $total;
$hash_pedido = sha1($hash_string);

$fecha_maxima_pago = date('Y-m-d H:i:s', strtotime('+20 minutes'));

$documento = !empty($user['documento']) ? $user['documento'] : "";
$telefono = !empty($user['telefono']) ? $user['telefono'] : "";
if ($telefono !== "" && strpos($telefono, '0') === 0) {
    $telefono = '+595' . substr($telefono, 1);
}

$payload = [
    "token" => $hash_pedido,
    "public_key" => PAGOPAR_PUBLIC_TOKEN,
    "monto_total" => $total,
    "tipo_pedido" => "VENTA-COMERCIO",
    "comprador" => [
        "ruc" => $documento,
        "email" => $user['email'],
        "ciudad" => 1, // 1 es Asuncion, requerido por pagopar
        "nombre" => trim($user['nombre'] . ' ' . $user['apellido']),
        "telefono" => $telefono,
        "direccion" => empty($deliveryCity) ? "" : $deliveryCity,
        "direccion_referencia" => "",
        "documento" => $documento,
        "coordenadas" => "",
        "razon_social" => trim($user['nombre'] . ' ' . $user['apellido']),
        "tipo_documento" => "CI"
    ],
    "compras_items" => $detallesPagopar,
    "fecha_maxima_pago" => $fecha_maxima_pago,
    "id_pedido_comercio" => (string)$venta_id,
    "descripcion_resumen" => "Compra en línea - Ticket #$venta_id"
];

$ch = curl_init('https://api.pagopar.com/api/comercios/2.0/iniciar-transaccion');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$resPagopar = json_decode($response, true);

if ($resPagopar && isset($resPagopar['respuesta']) && $resPagopar['respuesta'] === true) {
    $hash_pagopar = $resPagopar['resultado'][0]['data'];
    
    // Guardar el hash en la base de datos para usarlo en Mis Pedidos
    try {
        $stmtUpd = $pdo->prepare("UPDATE ventas SET pagopar_hash = ? WHERE id = ?");
        $stmtUpd->execute([$hash_pagopar, $venta_id]);
    } catch (Exception $e) {
        // Ignorar si la columna aún no existe
    }

    echo json_encode([
        'success' => true,
        'hash_pedido' => $hash_pagopar
    ]);
} else {
    // Revertir venta si falla Pagopar
    try {
        // Restauramos stock temporal
        $stmtRestoreStock = $pdo->prepare("UPDATE existencias SET cantidad_actual = cantidad_actual + ? WHERE producto_id = ?");
        foreach ($cartItems as $item) {
            $stmtRestoreStock->execute([$item['quantity'], $item['id']]);
        }
        // Eliminamos los detalles y la venta fantasma
        $pdo->prepare("DELETE FROM ventas_detalles WHERE venta_id = ?")->execute([$venta_id]);
        $pdo->prepare("DELETE FROM ventas WHERE id = ?")->execute([$venta_id]);
    } catch (Exception $e) {
        // Ignorar errores en el rollback
    }

    http_response_code(500);
    echo json_encode([
        'error' => 'Error al iniciar pago en Pagopar',
        'details' => $resPagopar,
        'payload' => $payload
    ]);
}
?>
