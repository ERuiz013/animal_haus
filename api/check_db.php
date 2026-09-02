<?php
require 'db.php';
try {
    echo "--- EXISTENCIAS ---\n";
    $stmt = $pdo->query("DESCRIBE existencias");
    print_r($stmt->fetchAll());
    echo "\n--- PRODUCTOS ---\n";
    $stmt = $pdo->query("DESCRIBE productos");
    print_r($stmt->fetchAll());
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
