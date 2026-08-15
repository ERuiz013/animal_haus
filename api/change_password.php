<?php
// api/change_password.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->uuid) || !isset($data->currentPassword) || !isset($data->newPassword)) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos (uuid, currentPassword, newPassword).']);
    exit;
}

$uuid = $data->uuid;
$currentPassword = $data->currentPassword;
$newPassword = $data->newPassword;

if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'La nueva contraseña debe tener al menos 6 caracteres.']);
    exit;
}

try {
    // 1. Obtener usuario de la base de datos
    $stmt = $pdo->prepare("SELECT password_hash FROM usuarios WHERE uuid = ? LIMIT 1");
    $stmt->execute([$uuid]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado.']);
        exit;
    }

    // 2. Verificar la contraseña actual
    if (!password_verify($currentPassword, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'La contraseña actual es incorrecta.']);
        exit;
    }

    // 3. Encriptar y guardar la nueva contraseña
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $pdo->prepare("UPDATE usuarios SET password_hash = ? WHERE uuid = ?");
    $updateStmt->execute([$hashedPassword, $uuid]);

    echo json_encode([
        'message' => 'Tu contraseña ha sido cambiada exitosamente.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos.', 'details' => $e->getMessage()]);
}
?>
