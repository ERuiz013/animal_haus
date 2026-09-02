<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'db.php';
try {
    $pdo->exec("ALTER TABLE ventas ADD COLUMN hash_pagopar VARCHAR(255) NULL");
    echo "Columna hash_pagopar agregada.";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "La columna ya existe.";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
?>
