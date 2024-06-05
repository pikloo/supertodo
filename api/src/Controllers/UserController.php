<?php

namespace SuperTodo\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use SuperTodo\Models\User;
use SuperTodo\Security\UserSecurity;
use SuperTodo\Utils\SendEmail;

class UserController extends CoreController
{
    private $security;
    private $mailer;

    public function __construct()
    {
        $this->security = new UserSecurity();
        $this->mailer =  new SendEmail();
    }

    public function create()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            $firstname = htmlspecialchars($data['firstname']);
            $lastname = htmlspecialchars($data['lastname']);
            $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
            $password = filter_var($data['password'], FILTER_SANITIZE_SPECIAL_CHARS);

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
                $this->json_response(503, ['errors' =>  $errorsList]);
            } else {
                $user = new User();
                $user->setFirstname($firstname);
                $user->setLastname($lastname);
                $user->setEmail($email);
                $user->setPassword(password_hash($password, PASSWORD_DEFAULT));
                //Générer un token d'activation
                $token = SecurityController::generateActivationToken();
                $user->setActivationToken($token);


                if ($user->save()) {
                    $data = [
                        'id' => $user->getId(),
                        'firstname' => $user->getFirstname(),
                        'lastname' => $user->getLastname(),
                        'email' => $user->getEmail()
                    ];

                    $this->json_response(201, $data);

                    //Envoyer un mail d'activation
                    $this->mailer->sendActivationEmail($user->getEmail(), $user->getFullName(), $user->getActivationToken());
                } else {
                    $this->json_response(502, ['error' => 'La sauvegarde a échoué']);
                }
            }
        } else {
            $this->json_response(400,  ['error' => 'invalid JSON data']);
        }
    }


    public function update($userId)
    {
        $user = User::find($userId);
        $user === null && $this->json_response(404, ['error' => 'Utilisateur non trouvé ']);
        $this->security->checkUserAuthorization($userId);

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                // dd($key);
                match (true) {
                    $key === 'firstname' && $value === '' => $errorsList[] = 'Le prénom est obligatoire',
                    $key === 'lastname' && $value === '' => $errorsList[] = 'Le nom est obligatoire',
                    $key === 'email' && $value === '' => $errorsList[] = 'L\'email est obligatoire',
                    $key === 'password' && $value === '' => $errorsList[] = 'Le mot de passe est obligatoire',
                    $key === 'email' && $value !== $user->getEmail() && User::findBy('email', filter_var($value, FILTER_VALIDATE_EMAIL)) => $errorsList[] = 'Cet e-mail est déja utilisé',
                    default =>  true,
                };
            }
            if (count($errorsList) > 0) {
                $this->json_response(503, ['errors' => $errorsList]);
            } else {
                foreach ($data as $key => $value) {
                    match (true) {
                        $key === 'firstname' => $user->setFirstname(htmlspecialchars($value)),
                        $key === 'lastname' => $user->setLastname(htmlspecialchars($value)),
                        $key === 'email' => $user->setEmail(filter_var($value, FILTER_VALIDATE_EMAIL)),
                        $key === 'password' => $user->setPassword(password_hash(filter_var($value, FILTER_SANITIZE_SPECIAL_CHARS), PASSWORD_DEFAULT))
                    };
                }
                $user->save() ? $this->json_response(200,  [
                    'id' => $user->getId(),
                    'firstname' => $user->getFirstname(),
                    'lastname' => $user->getLastname(),
                    'email' => $user->getEmail()
                ]) : $this->json_response(502, ['error' => 'La sauvegarde a échoué']);
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, ['error' => 'invalid JSON data']);
        }
    }


    public function read($userId)
    {
        global $router;
        // Route "me" (userId absent), décoder le token renvoyé
        !$userId && $userId = $this->getUserIdFromToken();

        $user = User::find($userId);
        $user === null && $this->json_response(404, ['error' => 'Utilisateur non trouvé ']);
        $this->security->checkUserAuthorization($user->getId());

        $datas = [
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
        ];

        $router->match()['name'] === 'readCurrentUser' && $datas = [...$datas, ...[
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'member_since' => $user->getMemberSince(),
        ]];

        $this->json_response(200, $datas);
    }

    public function delete($userId)
    {
        $user = User::find($userId);
        $user === null && $this->json_response(404, ['error' => 'Utilisateur non trouvé']);
        $this->security->checkUserAuthorization($userId);

        $user->delete() ? $this->json_response(204, ['message' => 'L\'utilisateur ' . $user->getId() . ' a bien été supprimé(e) '])  : $this->json_response(502, ['error' => 'La sauvegarde a échoué']);
    }

    private function getUserIdFromToken()
    {
        $jwt = $_COOKIE['jwt'];
        $secretKey  = getenv('JWT_SECRET_KEY');
        try {
            $payload = JWT::decode($jwt, new Key($secretKey, 'HS512'));
            return $payload->sub;
        } catch (\Exception $e) {
            $this->json_response(401, ['error' => 'Token invalide']);
        }
    }
}
