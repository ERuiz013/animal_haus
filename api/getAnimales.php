<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once "db.php";

try {
    $stmt = $pdo->query("SELECT * FROM animales WHERE estado = 1 ORDER BY nombre ASC");
    $animales = $stmt->fetchAll();
    echo json_encode($animales);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Ocurrió un error en el servidor.", "details" => $e->getMessage()]);
}
