<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';

if (!isset($_GET['usuario_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'usuario_id no proporcionado']);
    exit;
}

$uuid_or_id = $_GET['usuario_id'];

try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE uuid = ? OR id = ?");
    $stmt->execute([$uuid_or_id, $uuid_or_id]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(['products' => []]);
        exit;
    }
    
    $usuario_id = $user['id'];

    $sql = "SELECT p.* FROM productos p
            INNER JOIN usuarios_favoritos uf ON p.id = uf.articulo_id
            WHERE uf.usuario_id = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$usuario_id]);
    $products = $stmt->fetchAll();
    
    echo json_encode(['products' => $products]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
