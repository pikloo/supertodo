<?php

namespace SuperTodo\Models;

use PDO;
use SuperTodo\Utils\Database;

class Task extends CoreModel
{
    private $title;

    private $status;

    private $todo_id;

    public function insert()
    {
        $pdo = Database::getPDO();
        $sql = '
        INSERT INTO st_task(
        `title`, `status`,`todo_id`
        ) values (:title, :status, :todo_id)
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':title', $this->title, PDO::PARAM_STR);
        $pdoStatement->bindParam(':status', $this->status, PDO::PARAM_STR);
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
        UPDATE st_task
        SET
        title = :title,
        status = :status,
        todo_id = :todo_id,
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':title', $this->title, PDO::PARAM_STR);
        $pdoStatement->bindParam(':status', $this->status, PDO::PARAM_LOB);
        $pdoStatement->bindParam(':todo_id', $this->todo_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':id', $this->id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0);
    }

    public function delete(){
        $pdo = Database::getPDO();
        $sql = '
        DELETE FROM `st_task`
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $this->id, PDO::PARAM_INT);
        $pdoStatement->execute();
        if ($pdoStatement->rowCount() > 0) {
            return true;
        }
        return false;
    }

    public static function find($id)
    {
        $pdo = Database::getPDO();
        $sql = '
        SELECT * FROM st_task
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0)
            ? $pdoStatement->fetchObject(self::class)
            : null;
    }


    public static function findAllByTodoAndStatus($todoId, $status){
        $pdo = Database::getPDO();
        $sql =  '
        SELECT * FROM st_task t
        INNER JOIN st_todo to on t.todo_id = to.id
        WHERE to.id = :id
        AND t.status = :status
        GROUP BY t.id
        ORDER BY t.created_at DESC';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $todoId, PDO::PARAM_INT);
        $pdoStatement->bindParam(':status', $status, PDO::PARAM_STR);
        $pdoStatement->execute();
        $results = $pdoStatement->fetchAll(PDO::FETCH_CLASS, self::class);
        return $results;
    }

    /**
     * Get the value of title
     */ 
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set the value of title
     *
     * @return  self
     */ 
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get the value of status
     */ 
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Set the value of status
     *
     * @return  self
     */ 
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Get the value of todo_id
     */ 
    public function getTodo_id()
    {
        return $this->todo_id;
    }

    /**
     * Set the value of todo_id
     *
     * @return  self
     */ 
    public function setTodo_id($todo_id)
    {
        $this->todo_id = $todo_id;

        return $this;
    }
}

