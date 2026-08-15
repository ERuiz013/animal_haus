<?php
require 'db.php';
try {
    $pdo->exec("ALTER TABLE empresa ADD COLUMN link_facebook varchar(255) NULL, ADD COLUMN link_instagram varchar(255) NULL, ADD COLUMN link_tiktok varchar(255) NULL");
    echo "Columns added successfully";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "Columns already exist";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
?>
