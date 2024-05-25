<?php

namespace SuperTodo\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use SuperTodo\Models\UserHasTodo;
use SuperTodo\Controllers\CoreController;
use UnexpectedValueException;

final class TodoSecurity extends CoreController
{
    const WRITE_ACTIONS = ['create', 'update', 'delete'];
    const READ_ACTIONS = ['read', 'getTasks'];
    public function checkTodoAuthorization($todo, $action)
    {

        $this->router->match();
        if (!isset($_COOKIE['jwt'])) {
            $this->json_response(403, ['error' => 'Le cookie d\'authentification est manquant']);
            exit();
        } else {
            $jwt = $_COOKIE['jwt'];
            $secretKey  = getenv('JWT_SECRET_KEY');
            try {
                $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
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
                    default => $this->json_response(403, ['error' => 'Accès non autorisé']),
                };
            } catch (UnexpectedValueException $e) {
                $this->json_response(500, ['error' => $e]);
            }
        }
    }
}
