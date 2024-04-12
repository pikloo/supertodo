<?php

namespace SuperTodo\Controllers;

use SuperTodo\Models\User;

class UserController extends CoreController
{

    public function create()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            $firstname = $data['firstname'];
            $lastname = $data['lastname'];
            $email = $data['email'];
            $password = $data['password'];

            $errorsList = [];
            if ($firstname === '') {
                $errorsList[] = 'Le prénom est obligatoire';
            }

            if ($lastname === '') {
                $errorsList[] = 'Le prénom est obligatoire';
            }

            if ($email === '') {
                $errorsList[] = 'L\'email est obligatoire';
            }

            if ($password === '') {
                $errorsList[] = 'Le mot de passe est obligatoire';
            }

            if (User::findBy('email', $email)) {
                $errorsList[] = 'Cet e-mail est déja utilisé';
            }

            // if ($password !== '' && !preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',$password)) {
            //     $errorsList[] = 'Le mot de passe doit contenir au moins 1 lettre minuscule,
            //     1 lettre majuscule, 1 chiffre, 1 caractère spécial et faire au moins 8 caractères ';
            // }

            if ($email !== '' && !preg_match('/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/', $email)) {
                $errorsList[] = 'Cet email est invalide';
            }

            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
            } else {
                $user = new User();
                $user->setFirstname($firstname);
                $user->setLastname($lastname);
                $user->setEmail($email);
                $user->setPassword(password_hash($password, PASSWORD_DEFAULT));

                $user->save() ? $this->json_response(201,  $user, 'user') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, 'invalid JSON data', 'error');
        }
    }


    public function update($userId){
        $user = User::find($userId);
        $user === null && $this->json_response(404,  'Utilisateur non trouvé ', 'error');
        //TODO: check authorization

        $jsonData = file_get_contents('php://input');


    }
}
 