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

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID inválido']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM ajustes_existencias WHERE id = ?");
    $stmt->execute([$id]);
    $ajuste = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ajuste) {
        http_response_code(404);
        echo json_encode(['error' => 'Ajuste no encontrado']);
        exit;
    }
    
    $ajuste['fecha'] = $ajuste['creado_en'];

    $stmtDetalle = $pdo->prepare("
        SELECT d.*, p.nombre as producto_nombre
        FROM ajustes_existencias_detalles d
        JOIN productos p ON d.producto_id = p.id
        WHERE d.ajuste_id = ?
    ");
    $stmtDetalle->execute([$id]);
    $ajuste['detalles'] = $stmtDetalle->fetchAll(PDO::FETCH_ASSOC);
    $ajuste['tipo_ajuste'] = count($ajuste['detalles']) > 0 ? $ajuste['detalles'][0]['tipo_movimiento'] : 'desconocido';

    echo json_encode($ajuste);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error en el servidor', 'details' => $e->getMessage()]);
}
?>
