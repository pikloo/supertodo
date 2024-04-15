<?php

namespace SuperTodo\Controllers;

use DateTimeImmutable;
use Firebase\JWT\JWT;
use SuperTodo\Models\User;

class SecurityController extends CoreController
{
    public function getToken()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            // Access the data and perform operations
            $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
            $password = filter_var($data['password'], FILTER_SANITIZE_SPECIAL_CHARS);

            $errorsList = [];
            if ($email === '') {
                $errorsList[] = 'L\'email est obligatoire';
            }

            if ($password === '') {
                $errorsList[] = 'Le mot de passe est obligatoire';
            }

            $user = User::findBy('email', $email);
            if (!$user) {
                $errorsList[] = 'L\'email ou le mot de passe sont invalides';
            }

            if ($user && !password_verify($password, $user->getPassword())) {
                $errorsList[] = 'L\'email ou le mot de passe sont invalides';
            }

            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
            } else {
                $_SESSION['userId'] = $user->getId();
                $_SESSION['userObject'] = $user;
                // var_dump($user->getRole());exit();
                $token = $this->createJWT($user->getId(), $user->getRole());
                $this->json_response(200,  $token, 'token');
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, 'invalid JSON data', 'error');
        }
    }

    private function createJWT($userID, $role)
    {
        $secretKey  = getenv('JWT_SECRET_KEY');
        $date   = new DateTimeImmutable();
        $expire_at     = $date->modify('+20 minutes')->getTimestamp();
        $domainName = $_SERVER['HTTP_HOST'];
        $payload = [
            'iat'  => $date->getTimestamp(),         // Issued at: time when the token was generated
            'iss'  => $domainName,                       // Issuer
            'nbf'  => $date->getTimestamp(),         // Not before
            'exp'  => $expire_at,                           // Expire
            'sub' => $userID,
            'role' => $role
        ];

        $jwt = JWT::encode($payload, $secretKey, 'HS512');

        setcookie('jwt', $jwt, [
            'expires' => $date->getTimestamp(),
            'domain' => $domainName,
            'path' => '/', 'secure' => true,
            'httpOnly' => true
        ]);


        return $jwt;
    }
    

    public function logout()
    {
        $user = $_SESSION['userObject'];
        session_destroy();
        $this->json_response(200, 'message', $user->getFirstName() . ' ' . $user->getLastName . 'est déconnecté(e). A bientôt !');
    }


    public function refreshToken()
    {
    }
}
