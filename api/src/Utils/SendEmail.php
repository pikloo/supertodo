<?php

namespace SuperTodo\Utils;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class SendEmail
{

    public function sendActivationEmail($to, $toFullName, $token) {
        $body = $this->render(__DIR__ .'./../emails/activation.php', ['name' => $toFullName, 'activation_token' => $token]);
        $altBody = 'Bienvenue '. $toFullName .' !\n\n
        Ton inscription a bien été effectuée,\n\n
        Pour activer votre compte, clique sur le lien ci-dessous :\n
        http://localhost:9000/register/activation/'. $token. '\n\n
        A très bientot,\n\n
        La team Toudou\n\n
        Ce mail a été automatiquement envoyé à la suite de ton inscription, si tu ne souhaites pas poursuivre tu peux cliquer sur ce lien : http//localhost:9000';
        $this->send($to, $toFullName, 'Ton compte Toudou a', $body, $altBody);
    }

    private function send($to, $toFullName, $subject, $body, $altBody)
    {
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'smtp.example.com';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'user@example.com';                     //SMTP username
            $mail->Password   = 'secret';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
        
            //Recipients
            $mail->setFrom('from@example.com', 'Mailer');
            $mail->addAddress($to, $toFullName);     //Add a recipient
            // $mail->addReplyTo('info@example.com', 'Information');
            // $mail->addCC('cc@example.com');
            // $mail->addBCC('bcc@example.com');
        
            //Attachments
            // $mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
            // $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name
        
            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = $subject;
            $mail->Body    = $body;
            $mail->AltBody = $altBody;
        
            $mail->send();
            echo 'Message has been sent';
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    }

    private function render($path, $data = []){
        ob_start();
        extract($data);
        require __DIR__ . $path;
        return ob_get_clean();
    }


    
}
