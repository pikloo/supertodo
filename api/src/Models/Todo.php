<?php

namespace SuperTodo\Models;

use PDO;
use SuperTodo\Utils\Database;

class Todo extends CoreModel
{
    private $title;

    private $desc;

    private $user_id;

    public function insert()
    {
        $pdo = Database::getPDO();
        $sql = '
        INSERT INTO st_todo(
        `title`, `desc`,`user_id`
        ) values (:title, :desc, :user_id)
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':title', $this->title, PDO::PARAM_STR);
        $pdoStatement->bindParam(':desc', $this->desc, PDO::PARAM_LOB);
        $pdoStatement->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
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
        UPDATE st_user
        SET
        title = :title,
        desc = :desc,
        user_id = :user_id,
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':title', $this->title, PDO::PARAM_STR);
        $pdoStatement->bindParam(':desc', $this->desc, PDO::PARAM_LOB);
        $pdoStatement->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':id', $this->id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0);
    }

    public function delete(){
        $pdo = Database::getPDO();
        $sql = '
        DELETE FROM `st_todo`
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
        SELECT * FROM st_todo
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0)
            ? $pdoStatement->fetchObject(self::class)
            : null;
    }


    public static function findAllByUser($userId){
        $pdo = Database::getPDO();
        $sql =  '
        SELECT * FROM st_todo t
        INNER JOIN st_user u on t.user_id = u.id
        WHERE u.id = :id
        GROUP BY t.id
        ORDER BY t.created_at DESC';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $userId, PDO::PARAM_INT);
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
     * Get the value of desc
     */ 
    public function getDesc()
    {
        return $this->desc;
    }

    /**
     * Set the value of desc
     *
     * @return  self
     */ 
    public function setDesc($desc)
    {
        $this->desc = $desc;

        return $this;
    }

    /**
     * Get the value of user_id
     */ 
    public function getUser_id()
    {
        return $this->user_id;
    }

    /**
     * Set the value of user_id
     *
     * @return  self
     */ 
    public function setUser_id($user_id)
    {
        $this->user_id = $user_id;

        return $this;
    }

    
    
}

