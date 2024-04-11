<?php

namespace SuperTodo\Controllers;

use DateTimeImmutable;
use Firebase\JWT\JWT;
use SuperTodo\Controllers\CoreController;
use SuperTodo\Models\User;

class SecurityController extends CoreController
{

    public function getToken()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            // Access the data and perform operations
            $email = $data['email'];
            $password = $data['password'];

            $errorsList = [];
            if ($email === '') {
                $errorsList[] = 'L\'email est obligatoire';
            }

            if ($password === '') {
                $errorsList[] = 'Le mot de passe est obligatoire';
            }


            //StrongPassword
            // if ($password !== '' && !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',$password)) {
            //     $errorsList[] = 'Le mot de passe est invalide';
            // }

            $user = User::findBy('email', $email);
            if (!$user) {
                $errorsList[] = 'L\'email ou le mot de passe sont invalides';
            }

            // if ($user && !password_verify($password, $user->getPassword())) {
            //     $errorsList[] = 'L\'email ou le mot de passe sont invalides';
            // }

            if ($user && $password !== $user->getPassword()) {
                $errorsList[] = 'L\'email ou le mot de passe sont invalides';
            }

            if (count($errorsList) > 0) {
                $this->json_response(503,$errorsList, 'errors');
            } else {
                $_SESSION['userId'] = $user->getId();
                $_SESSION['userObject'] = $user;
                $token = $this->createJWT($user->getFirstName(), $user->getLastName());
                $this->json_response(200,  $token, 'token');
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, 'invalid JSON data', 'error');
        }
    }

    private function createJWT($lastname , $firstname)
    {
        $secret_Key  = 'RMwFrA5IKIwZLnAoRmJ3g1AHiLNIJbWe';
        $date   = new DateTimeImmutable();
        $expire_at     = $date->modify('+6 minutes')->getTimestamp();
        $domainName = $_SERVER['HTTP_HOST'];
        $username   = $firstname . ' ' . $lastname;
        $request_data = [
            'iat'  => $date->getTimestamp(),         // Issued at: time when the token was generated
            'iss'  => $domainName,                       // Issuer
            'nbf'  => $date->getTimestamp(),         // Not before
            'exp'  => $expire_at,                           // Expire
            'userName' => $username,   
        ];

        return JWT::encode(
            $request_data,
            $secret_Key,
            'HS512'
        );
    
    }
}
