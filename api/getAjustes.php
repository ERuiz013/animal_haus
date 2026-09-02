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

try {
    $stmt = $pdo->query("SELECT * FROM ajustes_existencias ORDER BY id DESC");
    $ajustes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($ajustes as &$ajuste) {
        $stmtDetalle = $pdo->prepare("SELECT tipo_movimiento FROM ajustes_existencias_detalles WHERE ajuste_id = ? LIMIT 1");
        $stmtDetalle->execute([$ajuste['id']]);
        $det = $stmtDetalle->fetch(PDO::FETCH_ASSOC);
        $ajuste['tipo_ajuste'] = $det ? $det['tipo_movimiento'] : 'desconocido';
        $ajuste['fecha'] = $ajuste['creado_en'];
    }
    
    echo json_encode($ajustes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
?>
