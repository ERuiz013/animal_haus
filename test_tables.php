<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';
$stmt = $pdo->query("SHOW TABLES");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
