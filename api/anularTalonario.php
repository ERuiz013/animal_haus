<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $id = $data->id;
    $sql = "UPDATE talonarios SET estado = 0 WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Talonario anulado exitosamente."]);
    } else {
        echo json_encode(["error" => "Error al anular talonario"]);
    }
} else {
    echo json_encode(["error" => "ID no proporcionado"]);
}
?>
