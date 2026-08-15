<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Manejo de preflight request de CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    $animal_id = isset($_GET['animal_id']) ? $_GET['animal_id'] : null;
    
    if ($animal_id) {
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE estado = 1 AND animal_id = ? ORDER BY nombre ASC");
        $stmt->execute([$animal_id]);
    } else {
        $stmt = $pdo->query("SELECT * FROM productos WHERE estado = 1 ORDER BY nombre ASC");
    }
    
    $productos = $stmt->fetchAll();
    echo json_encode($productos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
