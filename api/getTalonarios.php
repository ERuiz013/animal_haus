<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

$sql = "SELECT t.*, ti.nro_timbrado, ti.fecha_fin, ti.fecha_inicio 
        FROM talonarios t 
        LEFT JOIN timbrados ti ON t.timbrado_id = ti.id 
        ORDER BY t.id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute();
$talonarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($talonarios);
?>
