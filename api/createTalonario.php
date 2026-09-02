<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->timbrado_id) && !empty($data->tipo_comprobante) && !empty($data->establecimiento) && !empty($data->punto_expedicion) && !empty($data->numero_inicial) && !empty($data->numero_final)) {
    
    $timbrado_id = $data->timbrado_id;
    $tipo_comprobante = $data->tipo_comprobante;
    $establecimiento = $data->establecimiento;
    $punto_expedicion = $data->punto_expedicion;
    $numero_inicial = $data->numero_inicial;
    $numero_final = $data->numero_final;
    $numero_actual = isset($data->numero_actual) && $data->numero_actual !== '' ? $data->numero_actual : $numero_inicial;
    $estado = isset($data->estado) ? $data->estado : 1;

    $sql = "INSERT INTO talonarios (timbrado_id, tipo_comprobante, establecimiento, punto_expedicion, numero_inicial, numero_final, numero_actual, estado) 
            VALUES (:timbrado_id, :tipo_comprobante, :establecimiento, :punto_expedicion, :numero_inicial, :numero_final, :numero_actual, :estado)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':timbrado_id', $timbrado_id);
    $stmt->bindParam(':tipo_comprobante', $tipo_comprobante);
    $stmt->bindParam(':establecimiento', $establecimiento);
    $stmt->bindParam(':punto_expedicion', $punto_expedicion);
    $stmt->bindParam(':numero_inicial', $numero_inicial);
    $stmt->bindParam(':numero_final', $numero_final);
    $stmt->bindParam(':numero_actual', $numero_actual);
    $stmt->bindParam(':estado', $estado);

    if ($stmt->execute()) {
        $id = $pdo->lastInsertId();
        echo json_encode(["message" => "Talonario creado exitosamente.", "id" => $id]);
    } else {
        echo json_encode(["error" => "Error al crear talonario"]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>
