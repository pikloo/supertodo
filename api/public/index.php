<?php
require __DIR__ . '/../vendor/autoload.php';
session_start();

$router = new AltoRouter();

if (array_key_exists('BASE_URI', $_SERVER)) {
    $router->setBasePath($_SERVER['BASE_URI']);
} else {
    $_SERVER['BASE_URI'] = '';
}

require_once __DIR__ . './router.php';

//Dispatcher
$match = $router->match();

if ($match) {
    $controllerToUse = '\SuperTodo\Controllers\\' . $match['target']['controller'];
    $methodToUse = $match['target']['action'];
    $controller = new $controllerToUse();
    $controller->$methodToUse($match['params']);
} else {
    //TODO: Créer un controller Error
    echo 'PAGE NON TROUVEE';
}
