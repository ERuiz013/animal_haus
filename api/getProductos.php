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
    $tipo_precio = isset($_GET['tipo_precio']) ? $_GET['tipo_precio'] : null;
    $q = isset($_GET['q']) ? $_GET['q'] : null;
    
    $query = "SELECT p.*, COALESCE(SUM(e.cantidad_actual), 0) AS stock, MAX(e.cantidad_minima) AS stock_minimo 
              FROM productos p 
              LEFT JOIN existencias e ON p.id = e.producto_id 
              WHERE p.estado = 1";
    $params = [];

    if ($animal_id) {
        $query .= " AND p.animal_id = ?";
        $params[] = $animal_id;
    }

    if ($tipo_precio) {
        // e.g. "descuento,oferta" -> ['descuento', 'oferta']
        $tipos = explode(',', $tipo_precio);
        $placeholders = implode(',', array_fill(0, count($tipos), '?'));
        $query .= " AND p.tipo_precio IN ($placeholders)";
        foreach($tipos as $tipo) {
            $params[] = $tipo;
        }
    }

    if ($q) {
        $query .= " AND p.nombre LIKE ?";
        $params[] = "%$q%";
    }

    $query .= " GROUP BY p.id ORDER BY p.nombre ASC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    
    $productos = $stmt->fetchAll();
    echo json_encode($productos);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
