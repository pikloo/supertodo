<?php

namespace SuperTodo\Controllers;

use SuperTodo\Models\Task;
use SuperTodo\Models\Todo;
use SuperTodo\Models\UserHasTodo;

class TodoController extends CoreController
{

    public function create()
    {
        //TODO: check if user is logged in

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);
        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                match (true) {
                    $key === 'title' && $value === '' => $errorsList[] = 'Le titre est obligatoire',
                    $key === 'user' && $value === '' => $errorsList[] = 'L\'utilisateur propriétaire est obligatoire',
                };
            }
            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
            } else {
                $todo = new Todo();
                $todo->setTitle($data['title']);
                $todo->setDesc($data['desc']);
                $todo->setUserId($data['user']);

                $todo->save() ? $this->json_response(200,  $todo, 'todo') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, 'invalid JSON data', 'error');
        }
    }



    public function update($todoId)
    {
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        //TODO: check if user is logged in

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                match (true) {
                    $key === 'title' && $value === '' => $errorsList[] = 'Le titre est obligatoire',
                    $key === 'user' && $value === '' => $errorsList[] = 'L\'utilisateur propriétaire est obligatoire',
                };
            }

            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
            } else {
                foreach ($data as $key => $value) {
                    match (true) {
                        $key === 'title' => $todo->setTitle($value),
                        $key === 'desc' => $todo->setDesc($value),
                        $key === 'user' => $todo->setUserId($value),
                    };
                }
                $todo->save() ? $this->json_response(200,  $todo, 'todo') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
            }
        } else {
            $this->json_response(502,  'La sauvegarde a échoué', 'error');
        }
    }


    public function read($todoId){
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        //TODO: check authorization

        $this->json_response(200,  $todo, 'todo');
    }


    public function getTasks($todoId, $status){
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        //TODO: check authorization

        $tasks = Task::findAllByTodoAndStatus($todoId, $status);
        $this->json_response(200,  $tasks, 'tasks');
    }

    public function delete($todoId, $userId){
        $todo = Todo::find($todoId);
        $todo === null && $this->json_response(404,  'Ressource non trouvée', 'error');
        $userTodo = UserHasTodo::find($userId,$todoId);
        $userTodo === null && $this->json_response(404,  'Ressource non trouvée', 'error');
        //TODO: check authorization

        $todo->delete() && $userTodo->delete() ? $this->json_response(200,  'La liste de tâches' . $todo->getTitle() .' a bien été supprimée ' , 'message') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
    }
}
