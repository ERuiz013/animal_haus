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
    
    if (!isset($data['tipo_ajuste']) || !isset($data['motivo']) || !isset($data['detalles']) || count($data['detalles']) === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan datos requeridos o no hay productos para el ajuste.']);
        exit;
    }

    $pdo->beginTransaction();

    $usuario_id = 1; 
    $deposito_id = 1;
    $estado = 'aprobado';

    $stmtAjuste = $pdo->prepare("
        INSERT INTO ajustes_existencias (deposito_id, usuario_id, motivo, estado, observaciones, creado_en) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmtAjuste->execute([
        $deposito_id, 
        $usuario_id, 
        $data['motivo'], 
        $estado, 
        $data['motivo']
    ]);
    $ajuste_id = $pdo->lastInsertId();

    $stmtDetalle = $pdo->prepare("
        INSERT INTO ajustes_existencias_detalles (ajuste_id, producto_id, tipo_movimiento, cantidad) 
        VALUES (?, ?, ?, ?)
    ");
    
    if ($data['tipo_ajuste'] === 'entrada') {
        $stmtUpdateStock = $pdo->prepare("UPDATE existencias SET cantidad_actual = cantidad_actual + ? WHERE producto_id = ? AND deposito_id = ?");
    } else {
        $stmtUpdateStock = $pdo->prepare("UPDATE existencias SET cantidad_actual = cantidad_actual - ? WHERE producto_id = ? AND deposito_id = ?");
    }

    foreach ($data['detalles'] as $detalle) {
        $stmtDetalle->execute([
            $ajuste_id,
            $detalle['producto_id'],
            $data['tipo_ajuste'],
            $detalle['cantidad']
        ]);
        
        $stmtUpdateStock->execute([
            $detalle['cantidad'], 
            $detalle['producto_id'],
            $deposito_id
        ]);
        
        if ($stmtUpdateStock->rowCount() === 0 && $data['tipo_ajuste'] === 'entrada') {
            $stmtInsert = $pdo->prepare("INSERT INTO existencias (producto_id, deposito_id, cantidad_actual) VALUES (?, ?, ?)");
            $stmtInsert->execute([$detalle['producto_id'], $deposito_id, $detalle['cantidad']]);
        }
    }

    $pdo->commit();

    echo json_encode([
        'message' => 'Ajuste registrado con éxito.', 
        'ajuste_id' => $ajuste_id
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
?>
