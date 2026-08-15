<?php
require_once 'db.php';
$stmt = $pdo->query('SHOW TABLES');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('DESCRIBE productos');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt = $pdo->query('DESCRIBE ventas_detalles');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
