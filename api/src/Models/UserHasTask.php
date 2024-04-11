<?php

namespace SuperTodo\Models;

use PDO;
use SuperTodo\Utils\Database;

class UserHasTask extends CoreModel {
    private $user_id;

    private $task_id;

    public function insert(){
        $pdo = Database::getPDO();
        $sql = '
        INSERT INTO st_user_task(
        `user_id`,`task_id`
        ) values (:user_id, :task_id)
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':user_id',$this->user_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':task_id',$this->task_id, PDO::PARAM_INT);
        $pdoStatement->execute();
        if ( $pdoStatement->rowCount() > 0){
            //Récupération de l'auto-incrément généré par Mysql
            $this->id = $pdo->lastInsertId();
            return true;
        }
        return false;
    }

    public function update(){}

    public function delete(){
        $pdo = Database::getPDO();
        $sql = '
        DELETE FROM `st_user_task`
        WHERE user_id = :user_id
        AND task_id = :task_id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':task_id', $this->task_id, PDO::PARAM_INT);
        $pdoStatement->execute();
        if ($pdoStatement->rowCount() > 0) {
            return true;
        }
        return false;
    }

}

