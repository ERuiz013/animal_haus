<?php
require 'db.php';
try {
    $pdo->exec("ALTER TABLE empresa MODIFY COLUMN direcion TEXT NULL");
    echo "Column modified successfully";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
