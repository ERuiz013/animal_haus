<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require_once 'db.php';
try {
    $stmt = $pdo->query("DESCRIBE ventas");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        if ($col['Field'] == 'talonario_id' || $col['Field'] == 'nro_factura') {
            echo $col['Field'] . " - Null: " . $col['Null'] . "\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
