<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';
$stmt = $pdo->query("DESCRIBE existencias");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
