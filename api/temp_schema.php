<?php
require 'db.php';
$stmt = $pdo->query("DESCRIBE productos");
while($row = $stmt->fetch()) {
    echo $row['Field'] . " - " . $row['Type'] . "\n";
}
?>
