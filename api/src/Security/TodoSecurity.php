<?php

namespace SuperTodo\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use SuperTodo\Models\UserHasTodo;
use SuperTodo\Controllers\CoreController;
use UnexpectedValueException;

final class TodoSecurity extends CoreController
{
    const WRITE_ACTIONS = ['create','update', 'delete'];
    const READ_ACTIONS = ['read', 'getTasks'];
    public function checkTodoAuthorization($todo, $action)
    {

        $this->router->match();
        $headers = getallheaders();

        if (!array_key_exists('Authorization', $headers)) {
            $this->json_response(403, 'L\'en-tête authorization est manquant', 'error');
            exit();
        } else {
            if (substr($headers['Authorization'], 0, 7) !== 'Bearer ') {
                $this->json_response(403, 'Mot clé Bearer manquant', 'error');
                exit();
            } else {
                $token = trim(substr($headers['Authorization'], 7));
                $secretKey  = getenv('JWT_SECRET_KEY');
                try {
                    $decoded = JWT::decode($token, new Key($secretKey, 'HS512'));
                    $payload = json_decode(json_encode($decoded), true);
                    match (true) {
                        $action === 'create' && $payload['sub'] == $todo->getUserId() => true,
                        //Si le rôle du user co est ROLE_ADMIN
                        //ou si le user co est le propriétaire de la todo
                        //ou si le user co est dans la liste des contributeurs avec un role 'update'
                        //Alors il peut tout faire ( action !== 'create')
                        (
                            ($payload['role'] === 'ROLE_ADMIN'
                            || $payload['sub'] == $todo->getUserId()
                            || in_array($payload['sub'], array_column(UserHasTodo::findAllUsersByTodo($todo->getId()), 'user_id'))
                            &&  UserHasTodo::find($payload['sub'], $todo->getId())->getRole() === 'update') && $action !== 'create'
                        ) => true,
                        //Si le user co est dans la liste des contributeurs avec un role 'read'
                        //Il peur accéder seulement au méthode du tableau SELF::READ_ACTIONS
                        (in_array($payload['sub'],  array_column(UserHasTodo::findAllUsersByTodo($todo->getId()), 'user_id'))
                            &&  UserHasTodo::find($payload['sub'], $todo->getId())->getRole() === 'read')
                            && in_array($action, SELF::READ_ACTIONS) => true,
                            // Sinon Access Denied
                        default => $this->json_response(403, 'Accès non autorisé', 'error'),
                    };
                } catch (UnexpectedValueException $e) {
                    $this->json_response(500, $e, 'error');
                }
            }
        }
    }
}
