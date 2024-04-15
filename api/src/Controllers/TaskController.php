<?php

namespace SuperTodo\Controllers;

use SuperTodo\Models\Task;
use SuperTodo\Models\Todo;
use SuperTodo\Security\TodoSecurity;

class TaskController extends CoreController
{

    private $security;

    private const TASK_STATUS = [
        'todo', 'complete', 'doing'
    ];

    public function __construct()
    {
        $this->security = new TodoSecurity();
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
                    $key === 'status' && $value !== '' &&  !in_array($value, SELF::TASK_STATUS) => $errorsList[] = 'Le statut n\'est pas correct (todo | doing | complete).',
                    default => true,
                };
            }
            if (count($errorsList) > 0) {
                $this->json_response(503, $errorsList, 'errors');
                exit();
            } else {
                $todo =  Todo::find($data['todo']);
                $this->security->checkTodoAuthorization($todo, 'create');
                $task = new Task();
                $task->setTitle($data['title']);
                $task->setTodoId($data['todo']);
                $task->setStatus($data['status']);

                $task->save() ? $this->json_response(200,  [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'status' => $task->getStatus(),
                    'todo' => $todo->getId()
                ], 'task') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
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
        $this->security->checkTodoAuthorization($task->getTodo(), 'update');

        $jsonData = file_get_contents('php://input');
        $data = json_decode($jsonData, true);

        if ($data !== null) {
            $errorsList = [];
            foreach ($data as $key => $value) {
                match (true) {
                    $key === 'title' && $value === '' => $errorsList[] = 'Le titre est obligatoire',
                    $key === 'status' && $value === '' => $errorsList[] = 'Le statut est obligatoire',
                    $key === 'status' && $value !== '' &&  !in_array($value, SELF::TASK_STATUS) => $errorsList[] = 'Le statut n\'est pas correct (todo | doing | complete).',
                    !in_array($key, ['title', 'status']) => $this->json_response(400, 'invalid JSON data', 'error'),
                    default => true,
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
                $task->save() ? $this->json_response(200,  [
                    'id' => $task->getId(),
                    'title' => $task->getTitle(),
                    'status' => $task->getStatus(),
                    'todo' => $task->getTodoId()
                ], 'task') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
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
        $this->security->checkTodoAuthorization($task->getTodo(), 'read');

        $this->json_response(200,  [
            'id' => $task->getId(),
            'title' => $task->getTitle(),
            'status' => $task->getStatus(),
            'todo' => $task->getTodoId()
        ], 'task');
    }

    public function delete($taskId)
    {
        $task = Task::find($taskId);
        $task === null && $this->json_response(404,  'Ressource non trouvée ', 'error');
        $this->security->checkTodoAuthorization($task->getTodo(), 'delete');
        $task->delete() ? $this->json_response(204, 'La tâche' . $task->getTitle() . 'a été supprimée', 'message') : $this->json_response(502,  'La sauvegarde a échoué', 'error');
    }
}
