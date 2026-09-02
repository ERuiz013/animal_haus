<?php
require_once 'db.php';
$stmt = $pdo->query('DESCRIBE clientes');
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
