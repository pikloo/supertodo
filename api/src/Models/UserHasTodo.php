<?php

namespace SuperTodo\Models;

use PDO;
use SuperTodo\Utils\Database;

class UserHasTodo extends CoreModel
{
    private $user_id;

    private $todo_id;

    private $role;

    public function insert()
    {
        $pdo = Database::getPDO();
        $sql = '
        INSERT INTO st_user_todo(
        `user_id`,`todo_id`
        ) values (:user_id, :todo_id)
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':todo_id', $this->todo_id, PDO::PARAM_INT);
        $pdoStatement->execute();
        if ($pdoStatement->rowCount() > 0) {
            //Récupération de l'auto-incrément généré par Mysql
            $this->id = $pdo->lastInsertId();
            return true;
        }
        return false;
    }

    public function update()
    {
        $pdo = Database::getPDO();
        $sql = '
        UPDATE st_user_todo
        SET
        role = :role,
        WHERE user_id = :user_id
        AND todo_id = :todo_id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':role', json_encode($this->role), PDO::PARAM_LOB);
        $pdoStatement->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':todo_id', $this->todo_id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0);
    }

    public function delete()
    {
        $pdo = Database::getPDO();
        $sql = '
        DELETE FROM `st_user_todo`
        WHERE user_id = :user_id
        AND todo_id = :todo_id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':todo_id', $this->todo_id, PDO::PARAM_INT);
        $pdoStatement->execute();
        if ($pdoStatement->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public static function findAllTodosByUser($userId)
    {
        $pdo = Database::getPDO();
        $sql =  '
        SELECT * FROM st_user_todo ut
        INNER JOIN st_user u on ut.user_id = u.id
        INNER JOIN st_todo t on ut.todo_id = t.id
        WHERE u.id = :id
        GROUP BY t.id
        ORDER BY t.created_at DESC';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $userId, PDO::PARAM_INT);
        $pdoStatement->execute();
        $results = $pdoStatement->fetchAll(PDO::FETCH_CLASS, self::class);
        return $results;
    }


    public static function findAllUsersByTodo($todoId)
    {
        $pdo = Database::getPDO();
        $sql =  '
        SELECT user_id FROM st_user_todo ut
        WHERE ut.todo_id = :todo_id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':todo_id', $todoId, PDO::PARAM_INT);
        $pdoStatement->execute();
        $results = $pdoStatement->fetchAll(PDO::FETCH_CLASS, self::class);
        return $results;
    }


    public static function find($userId, $todoId)
    {
        $pdo = Database::getPDO();
        $sql =  '
        SELECT * FROM st_user_todo ut
        WHERE ut.user_id = :user_id
        AND ut.todo_id = :todo_id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $pdoStatement->bindParam(':todo_id', $todoId, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0)
            ? $pdoStatement->fetchObject(self::class)
            : null;
    }

    /**
     * Get the value of user_id
     */
    public function getUserId()
    {
        return $this->user_id;
    }

    /**
     * Set the value of user_id
     *
     * @return  self
     */
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;

        return $this;
    }

    /**
     * Get the value of todo_id
     */
    public function getTodoId()
    {
        return $this->todo_id;
    }

    /**
     * Set the value of todo_id
     *
     * @return  self
     */
    public function setTodoId($todo_id)
    {
        $this->todo_id = $todo_id;

        return $this;
    }

    /**
     * Get the value of role
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * Set the value of role
     *
     * @return  self
     */
    public function setRole($role)
    {
        $this->role = $role;

        return $this;
    }
}
