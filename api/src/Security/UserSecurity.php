<?php

namespace SuperTodo\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use SuperTodo\Controllers\CoreController as Core;
use UnexpectedValueException;

final class UserSecurity extends Core
{

    const WRITE_ACTIONS = ['update', 'delete'];
    const READ_ACTIONS = ['read'];
    /**
     * Check User Authorization: Vérifie si l'utilisateur connecté est celui donné en paramètre ou si il a le role ADMIN
     * 
     * Si la vérification échoue une réponse 403 est affichée
     * 
     * @param string $owner
     * @return void
     */
    public function checkUserAuthorization($owner)
    {
        if (!isset($_COOKIE['jwt'])) {
            $this->json_response(403, 'Le cookie d\'authentification est manquant', 'error');
            exit();
        } else {
            $jwt = $_COOKIE['jwt'];
            $secretKey  = getenv('JWT_SECRET_KEY');
            try {
                $decoded = JWT::decode($jwt, new Key($secretKey, 'HS512'));
                $payload = json_decode(json_encode($decoded), true);
                if ($payload['sub'] == $owner || $payload['role'] === "ROLE_ADMIN") {
                    return true;
                } else {
                    $this->json_response(403, 'Accès non autorisé', 'error');
                    exit();
                }
            } catch (UnexpectedValueException $e) {
                $this->json_response(500, $e, 'error');
            }
        }
    }
}
