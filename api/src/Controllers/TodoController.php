<?php

namespace SuperTodo\Controllers;

use SuperTodo\Models\Task;
use SuperTodo\Models\Todo;
use SuperTodo\Models\User;
use SuperTodo\Models\UserHasTodo;
use SuperTodo\Security\TodoSecurity;

class TodoController extends CoreController
{
    private $security;

    public function __construct()
    {
        $this->security = new TodoSecurity;
    }

    public function create()
    {
        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                match (true) {
                    $key === 'title' && $value === '' => $errorsList[] = 'Le titre est obligatoire',
                    $key === 'user' && $value === '' => $errorsList[] = 'L\'utilisateur propriétaire est obligatoire',
                    default => true,
                };
            }
            if (count($errorsList) > 0) {
                $this->json_response(503, ['error' =>  $errorsList]);
            } else {
                $todo = new Todo();
                $todo->setTitle($data['title']);
                isset($data['desc']) && $todo->setDesc($data['desc']);
                $todo->setUserId($data['user']);

                $this->security->checkTodoAuthorization($todo, 'create');

                if ($todo->save()) {
                    $user = User::find($todo->getUserId());
                    $data = [
                        'id' => $todo->getId(),
                        'title' => $todo->getTitle(),
                        'desc' => $todo->getDesc(),
                        'user' => [
                            'firstname' => $user->getFirstname(),
                            'lastname' => $user->getLastname(),
                            'email' => $user->getEmail()
                        ]
                    ];

                    $this->json_response(201, $data);

                    exit();
                }

                $this->json_response(502, ['error' => 'La sauvegarde a échoué']);
            }
        } else {
            // JSON decoding failed
            $this->json_response(400,  ['error' => 'invalid JSON data']);
        }
    }



    public function update($todoId)
    {
        $todo = Todo::find($todoId);
        $todo === null &&  $this->json_response(404, ['error' => 'Ressource non trouvée ']);
        $this->security->checkTodoAuthorization($todo, 'update');

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                match (true) {
                    $key === 'title' && $value === '' => $errorsList[] = 'Le titre est obligatoire',
                    $key === 'user' && $value === '' => $errorsList[] = 'L\'utilisateur propriétaire est obligatoire',
                    default => true,
                };
            }

            if (count($errorsList) > 0) {
                $this->json_response(503, ['errors' => $errorsList]);
            } else {
                foreach ($data as $key => $value) {
                    match (true) {
                        $key === 'title' => $todo->setTitle($value),
                        $key === 'desc' => $todo->setDesc($value),
                        $key === 'user' => $todo->setUserId($value),
                    };
                }

                if ($todo->save()) {
                    $user = User::find($todo->getUserId());
                    $data = [
                        'id' => $todo->getId(),
                        'title' => $todo->getTitle(),
                        'desc' => $todo->getDesc(),
                        'user' => [
                            'firstname' => $user->getFirstname(),
                            'lastname' => $user->getLastname(),
                            'email' => $user->getEmail()
                        ]
                    ];

                    $this->json_response(200, $data);
                    exit();
                }

                $this->json_response(502, ['error' => 'La sauvegarde a échoué']);
            }
        } else {
            $this->json_response(400, ['error' => 'invalid JSON data']);
        }
    }


    public function read($todoId)
    {
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,['error' =>'Ressource non trouvé ']);
        $this->security->checkTodoAuthorization($todo, 'read');

        $this->json_response(200,  [
            'id' => $todo->getId(),
            'title' => $todo->getTitle(),
            'desc' => $todo->getDesc(),
            'owner' => [
                'firstname' => $todo->getOwner()->getFirstname(),
                'lastname' => $todo->getOwner()->getLastname(),
                'email' => $todo->getOwner()->getEmail()
            ]
        ]);
    }


    public function getTasks($todoId, $status)
    {
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,['error' =>'Ressource non trouvé ']);;
        $this->security->checkTodoAuthorization($todo, 'getTasks');

        $tasks = Task::findAllByTodoAndStatus($todoId, $status);
        $this->json_response(200,  $tasks);
    }

    public function delete($todoId)
    {
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,['error' =>'Ressource non trouvé ']);;
        // $userTodo = UserHasTodo::find($userId, $todoId);
        // $userTodo === null && $this->json_response(404,  'Ressource non trouvée', 'error');
        $this->security->checkTodoAuthorization($todo, 'delete');

        $todo->delete() ? $this->json_response(204,  ['message '=> 'La liste de tâches' . $todo->getTitle() . ' a bien été supprimée ']) :$this->json_response(502, ['error' =>'La sauvegarde a échoué']);
    }
}
