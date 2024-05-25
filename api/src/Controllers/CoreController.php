<?php

namespace SuperTodo\Controllers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use UnexpectedValueException;

class CoreController
{
    // protected $router;
    protected $urlReferer;
    protected $baseURI;
    protected $router;
    private const ALLOWED_DOMAINS = [
        'localhost',
        '127.0.0.1',
        '192.168.127.12',
    ];

    public function __construct()
    {
        //TODO: Passer le routeur en arguments aux controllers au lieu d'utiliser global
        global $router;
        $this->router = $router;
        $this->configureAcl();
        $this->urlReferer = isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : null;
        $this->baseURI = $_SERVER['BASE_URI'];
    }

    /**
     * Gestion de l'enevoie de la réponse et de son status code HTTP
     * Supprime l'ancien entête et le remplace avec le status code fourni
     * Force le cache et renvoie une réponse avec le message
     *
     * @param integer $code
     * @param [type] $message
     * @return void
     */
    public function json_response($code, $message, $options = [])
    {
        // header_remove();
        http_response_code($code);

        $status = array(
            200 => '200 OK',
            201 => '201 Created',
            202 => '202 Accepted',
            203 => '203 Non-Authoritative Information',
            204 => '204 No Content',
            205 => '205 Reset Content',
            400 => '400 Bad Request',
            401 => '401 Unauthorized',
            402 => '402 Payment Required',
            403 => '403 Forbidden',
            404 => '404 Not Found',
            405 => '405 Method Not Allowed',
            422 => 'Unprocessable Entity',
            500 => '500 Internal Server Error',
            501 => '501 Not Implemented',
            502 => '502 Bad Gateway',
            503 => '503 Service Unavailable',
            504 => '504 Gateway Timeout',
            505 => '505 HTTP Version Not Supported',
        );

        header('Status:' . $status[$code]);

        if (!empty($options)) {
            foreach ($options as $option => $value) {
                header("$option: $value");
            };
        }

        echo json_encode($message);

        exit();
    }


    /**
     * Configure Acl: Paramétrage des restrictions d'accès à certaines routes en fonction des rôles
     *
     * @return void
     */
    private function configureAcl()
    {
        $acl = [
            'logout' => ['ROLE_USER'],
            'refreshToken' => ['ROLE_USER'],
            'readUser' => ['ROLE_USER'],
            'updateUser' => ['ROLE_USER'],
            'deleteUser' => ['ROLE_USER'],
            'createTodo' => ['ROLE_USER'],
            'readTodo' => ['ROLE_USER'],
            'deleteTodo' => ['ROLE_USER'],
            'readUserTodos' => ['ROLE_USER'],
            'createUserTodo' => ['ROLE_USER'],
            'updateUserTodo' => ['ROLE_USER'],
            'deleteUserTodo' => ['ROLE_USER'],
            'createUserTask' => ['ROLE_USER'],
            'createTask' => ['ROLE_USER'],
            'readTask' => ['ROLE_USER'],
            'updateTask' => ['ROLE_USER'],
            'deleteTask' => ['ROLE_USER'],
        ];

        $match = $this->router->match();
        if ($match) {
            $currentRouteName = $match['name'];

            if (array_key_exists($currentRouteName, $acl)) {
                $authorizedRoles = $acl[$currentRouteName];
                $this->checkRoleAuthorization($authorizedRoles);
            }
        }
    }


    /**
     * Check Role Authorization: Vérifie si le rôle de l'utilisateur connecté est dans le tableau de rôle donné en paramètre
     * 
     * Si la vérification échoue une réponse 403 est affichée
     * 
     * @param array $roles
     * @return void
     */
    private function checkRoleAuthorization($roles = [])
    {
        $headers = getallheaders();


        if (!isset($_COOKIE['jwt'])) {
            $this->json_response(403, ['error' => 'Le cookie d\'authentification est manquant']);
            exit();
        } else {
            $jwt = $_COOKIE['jwt'];
            $secretKey  = getenv('JWT_SECRET_KEY');
            try {
                $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
                $payload = json_decode(json_encode($decoded), true);

                if (in_array($payload['role'], $roles)) {
                    return true;
                } else {
                    $this->json_response(403, ['error' => 'Accès non autorisé']);
                    exit();
                }
            } catch (UnexpectedValueException $e) {
                $this->json_response(500, ['error' => $e]);
            }
        }
    }
}
