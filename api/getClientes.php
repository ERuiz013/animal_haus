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
    $q = isset($_GET['q']) ? $_GET['q'] : null;
    $query = "SELECT id, email, nombre, apellido, telefono, documento, is_active FROM usuarios WHERE is_active = 1 AND rol = '2'";
    $params = [];

    if ($q) {
        $query .= " AND (nombre LIKE ? OR apellido LIKE ?)";
        $params[] = "%$q%";
        $params[] = "%$q%";
    }

    $query .= " ORDER BY nombre ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $clientes = $stmt->fetchAll();
    echo json_encode($clientes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
