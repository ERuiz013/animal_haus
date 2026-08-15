<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
require 'db.php';

$data = json_decode(file_get_contents("php://input"));
if(empty($data->nombre) || empty($data->ruc)) {
    echo json_encode(['error' => 'Nombre y RUC son requeridos']);
    exit;
}

try {
    if (!empty($data->logo) && strpos($data->logo, 'data:image') === 0) {
        $parts = explode(',', $data->logo);
        if (count($parts) == 2) {
            $base64 = $parts[1];
            preg_match('/^data:image\/(\w+);base64/', $parts[0], $type);
            $extension = strtolower($type[1] ?? 'png');
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $decoded = base64_decode($base64);
                $filename = uniqid('logo_') . '.' . $extension;
                $uploadDir = __DIR__ . '/../uploads/';
                if (!is_dir($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }
                file_put_contents($uploadDir . $filename, $decoded);
                $data->logo = 'http://localhost/rjs_animal_haus/uploads/' . $filename;
            }
        }
    }

    $stmt = $pdo->prepare("INSERT INTO empresa (nombre, ruc, direcion, telefono, email, horario_abierto_entre_semana, horario_cerrado_entre_semana, horario_abierto_fin_semana, horario_cerrado_fin_semana, logo, link_facebook, link_instagram, link_tiktok) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data->nombre,
        $data->ruc,
        $data->direcion ?? null,
        $data->telefono ?? null,
        $data->email ?? null,
        $data->horario_abierto_entre_semana ?? null,
        $data->horario_cerrado_entre_semana ?? null,
        $data->horario_abierto_fin_semana ?? null,
        $data->horario_cerrado_fin_semana ?? null,
        $data->logo ?? null,
        $data->link_facebook ?? null,
        $data->link_instagram ?? null,
        $data->link_tiktok ?? null
    ]);
    echo json_encode(['message' => 'Empresa creada con éxito']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
