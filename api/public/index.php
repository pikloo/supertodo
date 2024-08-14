<?php
session_start();

require __DIR__ . '/../vendor/autoload.php';

$router = new AltoRouter();

$domain_url = getenv('DOMAIN_URL', true) ?: getenv('DOMAIN_URL');
$app_port = getenv('APP_PORT', true) ?: getenv('APP_PORT');

if ($domain_url) {
    $_SERVER['HTTP_HOST'] = $domain_url;
}

header_remove();
header("Access-Control-Allow-Origin: " . $domain_url . ':'. $app_port);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, DELETE, PATCH');
header('Access-Control-Allow-Credentials: true');

if (array_key_exists('BASE_URI', $_SERVER)) {
    $router->setBasePath($_SERVER['BASE_URI']);
} else {
    $_SERVER['BASE_URI'] = '';
}

require __DIR__ . '/router.php';

//Dispatcher
$match = $router->match();

if ($match) {
    $controllerToUse = '\SuperTodo\Controllers\\' . $match['target']['controller'];
    $methodToUse = $match['target']['action'];
    $controller = new $controllerToUse();
    if ($match['params'] && $match['params']['id'] && count($match['params']) === 1) {
        $controller->$methodToUse($match['params']['id']);
    } else {
        $controller->$methodToUse($match['params']);
    }
} else {
    //TODO: Créer un controller Error
    echo 'PAGE NON TROUVEE';
}
