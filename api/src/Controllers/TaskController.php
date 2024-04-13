<?php

namespace SuperTodo\Controllers;

use SuperTodo\Models\Task;
use SuperTodo\Security\TodoSecurity;

class TaskController extends CoreController
{
    
    private $security;

    public function __construct(TodoSecurity $security)
    {
        $this->security = $security;
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
                    $key === 'todo' && $value === '' => $errorsList[] = 'L\'ID de la liste est obligatoire',
                    $key === 'status' && $value === '' => $errorsList[] = 'Le statut est obligatoire',
                };
            }
            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
            } else {
                $this->security->checkTodoAuthorization($data['todo'], 'create');
                $task = new Task();
                $task->setTitle($data['title']);
                $task->setTodoId($data['todo']);
                $task->setStatus($data['status']);

                $task->save() ? $this->json_response(200,  $task, 'task') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, 'invalid JSON data', 'error');
        }
    }

    public function update($taskId)
    {
        $task = Task::find($taskId);
        $task === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        $this->security->checkTodoAuthorization($task->getTodoId(), 'update');

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                match (true) {
                    $key === 'title' && $value === '' => $errorsList[] = 'Le titre est obligatoire',
                    $key === 'status' && $value === '' => $errorsList[] = 'Le statut est obligatoire',
                    $key === 'todo' && $value === '' => $errorsList[] = 'L\'ID de la liste est obligatoire',
                };
            }
            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
            } else {
                foreach ($data as $key => $value) {
                    match (true) {
                        $key === 'title' => $task->setTitle($value),
                        $key === 'status' => $task->setStatus($value),
                    };
                }
                $task->save() ? $this->json_response(200,  $task, 'task') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
            }
        } else {
            // JSON decoding failed
            $this->json_response(400, 'invalid JSON data', 'error');
        }
    }


    public function read($taskId)
    {
        $task = Task::find($taskId);
        $task === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        $this->security->checkTodoAuthorization($task->getTodoId(), 'read');

        $this->json_response(200,  $task, 'task');
    }

    public function delete($taskId)
    {
        $task = Task::find($taskId);
        $task === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        $this->security->checkTodoAuthorization($task->getTodoId(), 'delete');
        $task->delete() ? $this->json_response(200, 'La tâche' . $task->getTitle() . 'a été supprimée', 'message') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
    }
}
