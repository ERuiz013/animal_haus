<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';
$stmt = $pdo->query('SHOW COLUMNS FROM pedidos');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('SHOW COLUMNS FROM ventas');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
