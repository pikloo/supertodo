<?php

namespace SuperTodo\Controllers;

class CoreController
{
    protected $router;
    protected $urlReferer;
    protected $baseURI;
    public function __construct()
    {
        $this->urlReferer = isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : null;
        $this->baseURI = $_SERVER['BASE_URI'];
    }



    /**
     * Gestion de l'nevoie de la réponse et de son status code HTTP
     * Supprime l'ancien entête et le remplace avec le status code fourni
     * Force le cache et renvoie une réponse avec le message
     *
     * @param integer $code
     * @param [type] $message
     * @return void
     */
    public function json_response($code = 200, $message, $key = 'message')
    {
        header_remove();
        http_response_code($code);
        header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
        header('Content-Type: application/json');
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
        header('Status: ' . $status[$code]);

        echo json_encode([
            'status' => $code < 300, // success or not?
            $key => $message
        ]);
    }
}
