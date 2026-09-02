<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT * FROM empresa LIMIT 1");
    $empresa = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($empresa) {
        if (!empty($empresa['logo'])) {
            $parts = explode('/uploads/', $empresa['logo']);
            if (count($parts) > 1) {
                $filename = end($parts);
                $localPath1 = __DIR__ . '/../uploads/' . $filename;
                $localPath2 = __DIR__ . '/../rjs_animal_haus/uploads/' . $filename;
                
                $finalPath = null;
                if (file_exists($localPath1)) {
                    $finalPath = $localPath1;
                } elseif (file_exists($localPath2)) {
                    $finalPath = $localPath2;
                }

                if ($finalPath) {
                    $type = pathinfo($finalPath, PATHINFO_EXTENSION);
                    $data = file_get_contents($finalPath);
                    $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
                    $empresa['logoBase64'] = $base64;
                }
            }
        }
        echo json_encode($empresa);
    } else {
        echo json_encode(['error' => 'Empresa no encontrada']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
?>
