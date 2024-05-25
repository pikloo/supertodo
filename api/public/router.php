<?php


/************************************* 
             Sécurity
/************************************/

$router->map(
    'POST',
    '/login',
    [
        'action' => 'getToken',
        'controller' => 'SecurityController',
    ],
    'getToken'
);

$router->map(
    'POST',
    '/logout',
    [
        'action' => 'logout',
        'controller' => 'SecurityController',
    ],
    'logout'
);

$router->map(
    'POST',
    '/refresh',
    [
        'action' => 'refreshToken',
        'controller' => 'SecurityController',
    ],
    'refreshToken'
);

/************************************* 
             USERS
/************************************/

$router->map(
    'POST',
    '/users',
    [
        'action' => 'create',
        'controller' => 'UserController',
    ],
    'createUser'
);

$router->map(
    'GET',
    '/me',
    [
        'action' => 'read',
        'controller' => 'UserController',
    ],
    'readCurrentUser'
);

$router->map(
    'GET',
    '/users/[i:id]',
    [
        'action' => 'read',
        'controller' => 'UserController',
    ],
    'readUser'
);

$router->map(
    'PATCH',
    '/users/[i:id]',
    [
        'action' => 'update',
        'controller' => 'UserController',
    ],
    'updateUser'
);

$router->map(
    'DELETE',
    '/users/[i:id]',
    [
        'action' => 'delete',
        'controller' => 'UserController',
    ],
    'deleteUser'
);


/************************************* 
             TODOS
/************************************/

$router->map(
    'POST',
    '/todos',
    [
        'action' => 'create',
        'controller' => 'TodoController',
    ],
    'createTodo'
);

$router->map(
    'GET',
    '/todos/[i:id]',
    [
        'action' => 'read',
        'controller' => 'TodoController',
    ],
    'readTodo'
);

$router->map(
    'PATCH',
    '/todos/[i:id]',
    [
        'action' => 'update',
        'controller' => 'TodoController',
    ],
    'updateTodo'
);

$router->map(
    'DELETE',
    '/todos/[i:id]',
    [
        'action' => 'delete',
        'controller' => 'TodoController',
    ],
    'deleteTodo'
);



/************************************* 
             TASKS
/************************************/

$router->map(
    'POST',
    '/tasks',
    [
        'action' => 'create',
        'controller' => 'TaskController',
    ],
    'createTask'
);

$router->map(
    'GET',
    '/tasks/[i:id]',
    [
        'action' => 'read',
        'controller' => 'TaskController',
    ],
    'readTask'
);

$router->map(
    'PATCH',
    '/tasks/[i:id]',
    [
        'action' => 'update',
        'controller' => 'TaskController',
    ],
    'updateTask'
);

$router->map(
    'DELETE',
    '/tasks/[i:id]',
    [
        'action' => 'delete',
        'controller' => 'TaskController',
    ],
    'deleteTask'
);



/************************************* 
    USER HAS TODO (COLLABORATION)
/************************************/

$router->map(
    'GET',
    '/users/[i:id]/todos',
    [
        'action' => 'readAll',
        'controller' => 'UserTodoController',
    ],
    'readUserTodos'
);

$router->map(
    'POST',
    '/users/[i:id]/todos/[i:id]',
    [
        'action' => 'create',
        'controller' => 'UserTodoController',
    ],
    'createUserTodo'
);

$router->map(
    'PATCH',
    '/users/[i:id]/todos/[i:id]',
    [
        'action' => 'update',
        'controller' => 'UserTodoController',
    ],
    'updateUserTodo'
);

$router->map(
    'DELETE',
    '/users/[i:id]/todos/[i:id]',
    [
        'action' => 'delete',
        'controller' => 'UserTodoController',
    ],
    'deleteUserTodo'
);


/************************************* 
    USER HAS TASK (ASSIGNEMENT)
/************************************/


$router->map(
    'POST',
    '/users/[i:id]/tasks/[i:id]',
    [
        'action' => 'create',
        'controller' => 'UserTaskController',
    ],
    'createUserTask'
);

$router->map(
    'DELETE',
    '/users/[i:id]/tasks/[i:id]',
    [
        'action' => 'delete',
        'controller' => 'UserTaskController',
    ],
    'deleteUserTask'
);






