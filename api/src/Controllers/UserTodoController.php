<?php

namespace SuperTodo\Controllers;

use SuperTodo\Models\User;
use SuperTodo\Models\UserHasTodo;

class UserTodoController extends CoreController{

    public function readAll($userId){
        $user = User::find($userId);
        $user === null && $this->json_response(404,  'Utilisateur non trouvé ', 'error');

        $todos = UserHasTodo::findAllTodosByUser($userId);
        //TODO: Envoyer le nombre total de projet en entete X-Total-Count
        // header("X-Total-Count:".count($todos));
        $dataTodos = [];
        foreach ($todos as $todo){
            $userTodo = UserHasTodo::find($userId, $todo->getTodoId());
            $dataTodos[] = [
                'id' => $todo->getTodoId(),
                'title' => $todo->getTodo()->getTitle(),
                'createdAt' => $todo->getTodo()->getCreatedAt(),
                'role' => $userTodo->getRole(),
            ];
        }
        $this->json_response(200, $dataTodos, ['X-Total-Count' => count($todos)]);
    }

}