<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';
try {
    $stmtDirecciones = $pdo->prepare("
        SELECT MAX(id) as max_id, direccion_envio 
        FROM pedidos 
        WHERE usuario_id = ? AND direccion_envio IS NOT NULL AND direccion_envio != ''
        GROUP BY direccion_envio
        ORDER BY max_id DESC 
        LIMIT 5
    ");
    $stmtDirecciones->execute([1]);
    $direcciones = [];
    while ($row = $stmtDirecciones->fetch()) {
        $direcciones[] = $row['direccion_envio'];
    }
    print_r($direcciones);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
