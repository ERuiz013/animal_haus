<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';

if (!isset($_POST['nombre'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato incorrecto o faltan datos requeridos (nombre).']);
    exit;
}

$categoria_id = $_POST['categoria_id'] ?? null;
$animal_id = $_POST['animal_id'] ?? null;
$uni_med_id = $_POST['uni_med_id'] ?? null;
$sku = $_POST['sku'] ?? null;
$nombre = $_POST['nombre'] ?? null;
$detalle = $_POST['detalle'] ?? null;
$tipo_precio = $_POST['tipo_precio'] ?? 'Normal';

if (!$nombre || !$sku || !$categoria_id || !$uni_med_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos requeridos (nombre, sku, categoria, unidad de medida).']);
    exit;
}

$slug = isset($_POST['slug']) && !empty($_POST['slug']) ? $_POST['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $nombre)));
$precio = isset($_POST['precio']) ? (int)$_POST['precio'] : 0;
$stock = isset($_POST['stock']) ? (int)$_POST['stock'] : 0;
$imagen = null;

// Handle file upload
if (isset($_FILES['imagen'])) {
    if ($_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileInfo = pathinfo($_FILES['imagen']['name']);
        $extension = strtolower($fileInfo['extension']);
        
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (in_array($extension, $allowedExts)) {
            $fileName = uniqid('prod_') . '.' . $extension;
            $destination = $uploadDir . $fileName;
            
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $destination)) {
                $imagen = 'api/' . $destination;
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Error al mover el archivo subido al destino.']);
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Formato de imagen no permitido. Solo se permiten jpg, jpeg, png, gif, webp.']);
            exit;
        }
    } else if ($_FILES['imagen']['error'] !== UPLOAD_ERR_NO_FILE) {
        http_response_code(400);
        $errorMsg = 'Error desconocido al subir la imagen.';
        switch ($_FILES['imagen']['error']) {
            case UPLOAD_ERR_INI_SIZE:
                $errorMsg = 'La imagen excede el tamaño máximo permitido por el servidor.';
                break;
            case UPLOAD_ERR_FORM_SIZE:
                $errorMsg = 'La imagen excede el tamaño máximo permitido por el formulario.';
                break;
            case UPLOAD_ERR_PARTIAL:
                $errorMsg = 'La imagen se subió parcialmente.';
                break;
        }
        echo json_encode(['error' => $errorMsg]);
        exit;
    }
}

try {
    $stmt = $pdo->prepare("INSERT INTO productos (categoria_id, animal_id, uni_med_id, sku, nombre, slug, precio, stock, imagen, detalle, tipo_precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$categoria_id, $animal_id, $uni_med_id, $sku, $nombre, $slug, $precio, $stock, $imagen, $detalle, $tipo_precio]);

    echo json_encode(['message' => 'Producto creado correctamente', 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ocurrió un error en el servidor.', 'details' => $e->getMessage()]);
}
