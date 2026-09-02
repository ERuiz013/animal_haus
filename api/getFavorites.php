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
        echo json_encode(['favorites' => []]);
        exit;
    }
    
    $usuario_id = $user['id'];

    $stmt = $pdo->prepare("SELECT articulo_id FROM usuarios_favoritos WHERE usuario_id = ?");
    $stmt->execute([$usuario_id]);
    $favorites = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode(['favorites' => $favorites]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
