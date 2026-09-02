<?php
require 'db.php';
$stmt = $pdo->query('SHOW COLUMNS FROM existencias');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
