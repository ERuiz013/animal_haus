<?php
$_SERVER['HTTP_HOST'] = 'localhost';
require 'api/db.php';
$_GET['usuario_id'] = 1;
require 'api/getFavorites.php';
?>
