<?php

namespace SuperTodo\Controllers;

use SuperTodo\Controllers\CoreController;
use SuperTodo\Models\User;

class SecurityController extends CoreController
{

    public function getToken()
    {
        $email = filter_input(INPUT_POST, 'email');
        $password = filter_input(INPUT_POST, 'password');

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

        if ($user && !password_verify($password, $user->getPassword())) {
            $errorsList[] = 'L\'email ou le mot de passe sont invalides';
        }

        if (count($errorsList) > 0) {
            $this->json_response(503, $errorsList);
        } else {
            $_SESSION['userId'] = $user->getId();
            $_SESSION['userObject'] = $user;
            //TODO: Générer un token et le renvoyer
            $this->json_response(200, "connecté!!");
        }
    }
}
