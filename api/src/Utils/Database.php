<?php
namespace SuperTodo\Utils;
use PDO;

class Database {
    private static $_instance;
    private $dbh;
    private function __construct() {
        try {
            $this->dbh = new PDO(
                'mysql:host='. getenv('PMA_HOST') .';dbname='. getenv('MYSQL_DATABASE') .';charset=utf8',
                getenv('MYSQL_USER'),
                getenv('MYSQL_PASSWORD'),
                array(PDO::ATTR_ERRMODE => PDO::ERRMODE_WARNING) // Affiche les erreurs SQL à l'écran
            );
        }
        catch(\Exception $exception) {
            echo 'Erreur de connexion...<br>';
            echo $exception->getMessage().'<br>';
            echo '<pre>';
            echo $exception->getTraceAsString();
            echo '</pre>';
            exit;
        }
    }
    // the unique method you need to use
    public static function getPDO() {
        // If no instance => create one
        if (empty(self::$_instance)) self::$_instance = new Database();
        return self::$_instance->dbh;
        
    }
}
?>