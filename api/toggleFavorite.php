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

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->usuario_id) || !isset($data->articulo_id) || !isset($data->action)) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos incompletos']);
    exit;
}

$uuid_or_id = $data->usuario_id;
$articulo_id = $data->articulo_id;
$action = $data->action;

try {
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE uuid = ? OR id = ?");
    $stmt->execute([$uuid_or_id, $uuid_or_id]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit;
    }
    
    $usuario_id = $user['id'];

    if ($action === 'add') {
        $stmt = $pdo->prepare("INSERT IGNORE INTO usuarios_favoritos (usuario_id, articulo_id) VALUES (?, ?)");
        $stmt->execute([$usuario_id, $articulo_id]);
    } else if ($action === 'remove') {
        $stmt = $pdo->prepare("DELETE FROM usuarios_favoritos WHERE usuario_id = ? AND articulo_id = ?");
        $stmt->execute([$usuario_id, $articulo_id]);
    }
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
