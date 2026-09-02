<?php
require 'db.php';
$stmt = $pdo->query('SHOW COLUMNS FROM ventas_detalles');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
