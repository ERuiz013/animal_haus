<?php
// api/db.php
// Detectar entorno para usar base de datos local o de producción en cPanel
$is_local = isset($_SERVER['HTTP_HOST']) && in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1', '::1']);

if ($is_local) {
    // Credenciales Locales
    $host = '127.0.0.1';
    $db   = 'rjs_animal_haus';
    $user = 'root';
    $pass = ''; // Por defecto XAMPP no tiene contraseña
} else {
    // Credenciales de Producción (HostGator)
    $host = 'localhost';
    $db   = 'eliasrui_rjs_animal_haus';
    $user = 'eliasrui_root';
    $pass = '548Eliasruiz*'; // TODO: PONER CONTRASEÑA ANTES DE SUBIR
}

$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // Configurar la zona horaria para PHP (para funciones como date())
    date_default_timezone_set('America/Asuncion');
    
    // Configurar la zona horaria para MySQL (para funciones como NOW())
    try {
        $pdo->exec("SET time_zone = 'America/Asuncion'");
    } catch (Exception $e) {
        // Fallback al UTC-4 (hora estándar de Paraguay) si el servidor no tiene los nombres instalados
        $pdo->exec("SET time_zone = '-04:00'");
    }
} catch (\PDOException $e) {
    http_response_code(500);
    die(json_encode(['error' => 'Error de conexión a la base de datos']));
}
