<?php
$db = 'rjs_animal_haus'; $user = 'root'; $pass = '';
$pdo = new PDO("mysql:host=localhost;dbname=$db;charset=utf8mb4", $user, $pass);
$stmt = $pdo->query("SELECT id, nombre, imagen FROM productos LIMIT 5");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
