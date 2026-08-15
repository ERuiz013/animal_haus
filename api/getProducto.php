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

if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el parámetro id del producto.']);
    exit;
}

$id = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("SELECT p.*, c.nombre as categoria_nombre, u.nombre as unidad_nombre 
                           FROM productos p 
                           LEFT JOIN categorias c ON p.categoria_id = c.id
                           LEFT JOIN unidades_medidas u ON p.uni_med_id = u.id
                           WHERE p.id = ? AND p.estado = 1");
    $stmt->execute([$id]);
    $producto = $stmt->fetch();

    if (!$producto) {
        http_response_code(404);
        echo json_encode(['error' => 'Producto no encontrado o inactivo.']);
        exit;
    }

    echo json_encode($producto);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
