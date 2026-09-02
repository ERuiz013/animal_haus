<?php
$pdo = new PDO('mysql:host=127.0.0.1;dbname=rjs_animal_haus;charset=utf8mb4', 'root', '');
$stmt = $pdo->query('DESCRIBE usuarios');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
$stmt2 = $pdo->query('DESCRIBE clientes');
if($stmt2) print_r($stmt2->fetchAll(PDO::FETCH_ASSOC));
