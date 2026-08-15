<?php
// api/recover_password.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
require_once 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email)) {
    http_response_code(400);
    echo json_encode(['error' => 'Por favor, ingrese el correo electrónico.']);
    exit;
}

$email = filter_var(trim($data->email), FILTER_SANITIZE_EMAIL);

try {
    // 1. Verificar si el usuario existe
    $stmt = $pdo->prepare("SELECT uuid, nombre FROM usuarios WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => 'El correo electrónico ingresado no se encuentra registrado.']);
        exit;
    }

    // 2. Generar nueva contraseña aleatoria (8 caracteres)
    $newPassword = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // 3. Actualizar la contraseña en la base de datos
    $updateStmt = $pdo->prepare("UPDATE usuarios SET password_hash = ? WHERE uuid = ?");
    $updateStmt->execute([$hashedPassword, $user['uuid']]);

    // 4. Enviar correo usando PHPMailer
    $mail = new PHPMailer(true);

    // ==========================================
    // CONFIGURACIÓN SMTP (REEMPLAZAR CON DATOS REALES)
    // ==========================================
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';             // Servidor SMTP (ej: smtp.gmail.com)
    $mail->SMTPAuth   = true;                         // Activar autenticación SMTP
    $mail->Username   = 'animalhausparaguay@gmail.com';        // TU CORREO AQUÍ
    $mail->Password   = 'vwpc agjh dzyq xeth';   // TU CONTRASEÑA DE APLICACIÓN AQUÍ
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Encriptación TLS
    $mail->Port       = 587;                          // Puerto TCP
    
    // Desactivar temporalmente la verificación SSL si hay problemas en localhost (solo para desarrollo)
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );
    // ==========================================

    $mail->setFrom('no-reply@animalhaus.com', 'Animal Haus');
    $mail->addAddress($email, $user['nombre']);

    // Contenido del correo
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Recuperación de Contraseña - Animal Haus';
    // Adjuntar logo embebido
    $logoPath = __DIR__ . '/../src/assets/animalhause.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'logo_animalhaus');
        $imgTag = '<br><img src="cid:logo_animalhaus" alt="Animal Haus" style="width: 150px; margin-top: 15px;">';
    } else {
        $imgTag = '';
    }

    $mail->Body    = "
        <h2>Hola {$user['nombre']},</h2>
        <p>Has solicitado restablecer tu contraseña. Tu nueva contraseña temporal es:</p>
        <p><strong>{$newPassword}</strong></p>
        <p>Te recomendamos cambiar esta contraseña luego de iniciar sesión.</p>
        <br>
        <p>Saludos,<br>El equipo de Animal Haus</p>
        {$imgTag}
    ";
    $mail->AltBody = "Hola {$user['nombre']},\n\nTu nueva contraseña temporal es: {$newPassword}\n\nTe recomendamos cambiar esta contraseña luego de iniciar sesión.\n\nSaludos,\nEl equipo de Animal Haus";

    $mail->send();

    echo json_encode([
        'message' => 'Se ha enviado una nueva contraseña a su correo electrónico.'
    ]);

} catch (Exception $e) {
    // Para depuración, devolvemos el error de PHPMailer
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo enviar el correo. Por favor, configura el servidor SMTP en api/recover_password.php', 'details' => $mail->ErrorInfo]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de base de datos.', 'details' => $e->getMessage()]);
}
?>
