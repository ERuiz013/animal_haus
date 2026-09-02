<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el ID del cliente.']);
        exit;
    }

    $id = $_GET['id'];

    $stmt = $pdo->prepare("
        SELECT u.id, u.email, u.nombre, u.apellido, u.telefono, u.documento, u.created_at
        FROM usuarios u 
        WHERE u.id = ?
    ");
    $stmt->execute([$id]);
    $cliente = $stmt->fetch();

    if ($cliente) {
        $stmtDirecciones = $pdo->prepare("
            SELECT MAX(id) as max_id, direccion_envio 
            FROM ventas 
            WHERE cliente_id = ? AND direccion_envio IS NOT NULL AND direccion_envio != ''
            GROUP BY direccion_envio
            ORDER BY max_id DESC 
            LIMIT 5
        ");
        $stmtDirecciones->execute([$id]);
        
        $direcciones = [];
        while ($row = $stmtDirecciones->fetch()) {
            $direcciones[] = $row['direccion_envio'];
        }
        $cliente['direcciones'] = $direcciones;

        echo json_encode($cliente);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Cliente no encontrado']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
?>
