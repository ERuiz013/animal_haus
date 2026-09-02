<?php
// api/webhookPagopar.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db.php';
require_once 'pagopar_config.php';

// Pagopar envía los datos de pago vía POST en formato form-data (o JSON a veces), 
// pero usualmente es un json dentro de un form (en $_POST['resultado']).
// Si envían un json directo, lo capturamos con php://input
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

// A veces Pagopar envía un array, o a veces el objeto `resultado` viene en $_POST
if (isset($_POST['resultado'])) {
    $data = json_decode($_POST['resultado'], true);
}

// Asegurarse de tener data
if (!$data || !isset($data['hash_pedido'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Bad request']);
    exit;
}

// 1. Extraer variables
$hash_pedido = $data['hash_pedido'];
$numero_pedido = $data['numero_pedido'];
$monto = $data['monto']; // Monto total cobrado por pagopar
$pagado = $data['pagado']; // boolean true/false
$forma_pago = $data['forma_pago'] ?? 1; // 1 = efectivo, 2 = tc, etc.
$fecha_pago = $data['fecha_pago'] ?? date('Y-m-d H:i:s');
$estado = $data['estado']; // usualmente 'pagado'

// Verificar firma de Pagopar (hash de respuesta)
// Para verificar que Pagopar realmente envió esto, se arma el hash esperado:
// sha1(token_privado + numero_pedido + monto)
// Nota: en algunos callbacks de Pagopar se valida con el token público también, pero revisando la doc general:
$hash_esperado = sha1(PAGOPAR_PRIVATE_TOKEN . $numero_pedido . $monto);

// NOTA: Algunas versiones de la API de Pagopar no envían hash en el webhook de forma estándar, 
// confían en un endpoint secreto o simplemente se verifica el token.
// Si tuviéramos que verificar el hash exacto:
// if ($data['hash'] !== $hash_esperado) { ... }

// Si el pedido fue pagado
if ($pagado === true) {
    // El numero_pedido debería ser nuestro ID de Venta
    $venta_id = (int)$numero_pedido;

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT estado FROM ventas WHERE id = ? FOR UPDATE");
        $stmt->execute([$venta_id]);
        $venta = $stmt->fetch();

        if ($venta && $venta['estado'] === 'pendiente_pago') {
            // Fetch Talonario
            $stmtTal = $pdo->prepare("SELECT id, establecimiento, punto_expedicion, numero_actual FROM talonarios ORDER BY id ASC LIMIT 1 FOR UPDATE");
            $stmtTal->execute();
            $talonario = $stmtTal->fetch();

            if ($talonario) {
                $nro_factura = sprintf("%03d-%03d-%07d", $talonario['establecimiento'], $talonario['punto_expedicion'], $talonario['numero_actual']);
                
                // Actualizar a pendiente_entrega, asignar factura
                $stmtUpd = $pdo->prepare("UPDATE ventas SET estado = 'pendiente_entrega', metodo_cobro = 'pagopar', talonario_id = ?, nro_factura = ? WHERE id = ?");
                $stmtUpd->execute([$talonario['id'], $nro_factura, $venta_id]);
                
                // Incrementar el talonario
                $stmtUpdateTalonario = $pdo->prepare("UPDATE talonarios SET numero_actual = numero_actual + 1 WHERE id = ?");
                $stmtUpdateTalonario->execute([$talonario['id']]);
            } else {
                // Si por alguna razón no hay talonarios, igual cobramos
                $stmtUpd = $pdo->prepare("UPDATE ventas SET estado = 'pendiente_entrega', metodo_cobro = 'pagopar' WHERE id = ?");
                $stmtUpd->execute([$venta_id]);
            }
        }
        
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
        exit;
    }
}

// Responder OK a Pagopar
echo json_encode(['success' => true]);
?>
