<?php
require 'api/pagopar_config.php';

$venta_id = 99999;
$total = 15000;

$hash_string = PAGOPAR_PRIVATE_TOKEN . $venta_id . $total;
$hash_pedido = sha1($hash_string);

$fecha_maxima_pago = date('Y-m-d H:i:s', strtotime('+24 hours'));

$payload = [
    "token_publico" => PAGOPAR_PUBLIC_TOKEN,
    "monto_total" => $total,
    "tipo_pedido" => "VENTA-COMERCIO",
    "comprador" => [
        "ruc" => "0", 
        "email" => "test@test.com",
        "ciudad" => 1, 
        "nombre" => "Juan Perez",
        "telefono" => "0981123456",
        "direccion" => "Test",
        "documento" => "1234567",
        "coordenadas" => "",
        "razon_social" => "Juan Perez",
        "tipo_documento" => "CI"
    ],
    "detalles_pedido" => [
        [
            "id_producto" => 1,
            "cantidad" => 1,
            "descripcion" => "Producto de prueba",
            "precio_total" => 15000
        ]
    ],
    "fecha_maxima_pago" => $fecha_maxima_pago,
    "id_pedido_comercio" => (string)$venta_id,
    "descripcion_resumen" => "Compra en línea - Ticket #$venta_id",
    "hash_pedido" => $hash_pedido
];

echo "Payload:\n";
print_r(json_encode($payload, JSON_PRETTY_PRINT));
echo "\n\nResponse:\n";

$ch = curl_init('https://api.pagopar.com/api/comercio/transaccion-step-0.7');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo $response;
?>
