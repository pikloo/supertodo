<?php

namespace SuperTodo\Utils;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class SendEmail
{

    private CONST EMAIL_ACTIVATION_TEMPLATE_PATH = __DIR__ .'./../emails/activation.php';
    private CONST EMAIL_RESET_PASSWORD_TEMPLATE_PATH = __DIR__ .'./../emails/reset_password.php';
    private const EMAIL_ACTIVATION_SUBJECT = 'Bienvenue sur TOUDOU !';


    public function sendActivationEmail($to, $toFullName, $token) {
        $activation_url = getenv('DOMAIN_URL').':'.getenv('APP_PORT').'/register/activation/'. $token;
        $body = $this->render(self::EMAIL_ACTIVATION_TEMPLATE_PATH, ['name' => $toFullName, 'activation_url' => $activation_url]);
        $altBody = 'Bienvenue '. $toFullName .' !\n\n
        Ton inscription a bien été effectuée,\n\n
        Pour activer votre compte, clique sur le lien ci-dessous :\n
        ' .$activation_url. '\n\n
        A très bientot,\n\n
        La team Toudou\n\n
        Ce mail a été automatiquement envoyé à la suite de ton inscription, si tu ne souhaites pas poursuivre tu peux cliquer sur ce lien : http//localhost:9000';
        $this->send($to, $toFullName, self::EMAIL_ACTIVATION_SUBJECT, $body, $altBody);
    }

    private function send($to, $toFullName, $subject, $body, $altBody)
    {        
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_OFF;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = getenv('MAIL_HOST');                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = null;                     //SMTP username
            $mail->Password   = null;                               //SMTP password
            $mail->SMTPSecure = null;            //Enable implicit TLS encryption
            $mail->Port       = getenv('MAIL_PORT');;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        
            //Recipients
            $mail->setFrom(getenv('MAIL_ADDRESS'), 'Toudou');
            $mail->addAddress($to, $toFullName); 
        
            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
        
            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->AltBody = $altBody;
        
            $mail->send();
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }

    private function render($path, $data = []){
        ob_start();
        extract($data);
        require  $path;
        return ob_get_clean();
    } 
}
