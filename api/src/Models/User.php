<?php

namespace SuperTodo\Models;

use PDO;
use SuperTodo\Utils\Database;

class User extends CoreModel
{
    private $firstname;

    private $lastname;

    private $email;

    private $password;

    private $roles;

    public function insert()
    {
        $pdo = Database::getPDO();
        $sql = '
        INSERT INTO st_user(
        `firsname`, `lastname`,`email`,`password`, `roles`)
        ) values (:firstname, :lastname, :email, :password, :roles)
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':firstname', $this->firstname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':lastname', $this->lastname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':email', $this->email, PDO::PARAM_STR);
        $pdoStatement->bindParam(':password', $this->password, PDO::PARAM_STR);
        $pdoStatement->bindParam(':roles', $this->roles, PDO::PARAM_LOB);
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
            firstname = :firstname,
            lastname = :lastname,
            email = :email,
            password = :password,
            roles = :roles
            updated_at = NOW()
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':firstname', $this->firstname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':lastname', $this->lastname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':email', $this->email, PDO::PARAM_STR);
        $pdoStatement->bindParam(':password', $this->password, PDO::PARAM_STR);
        $pdoStatement->bindParam(':roles', $this->roles, PDO::PARAM_LOB);
        $pdoStatement->bindParam(':id', $this->id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0);
    }

    public static function find($id)
    {
        $pdo = Database::getPDO();
        $sql = '
        SELECT * FROM st_user
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0)
            ? $pdoStatement->fetchObject(self::class)
            : null;
    }
    
    public static function findBy($field, $value)
    {
        $pdo = Database::getPDO();
        $sql = '
        SELECT * FROM st_user
        WHERE ' . $field . ' = :value
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':value', $value, PDO::PARAM_STR);
        $pdoStatement->execute();
        $item = $pdoStatement->fetchObject(self::class);

        return $item;
    }

    public function delete(){
        $pdo = Database::getPDO();
        $sql = '
        DELETE FROM `st_user`
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


    public function __construct() {
        $this->roles = ['ROLE_USER'];
    }


    /**
     * Get the value of firstname
     */ 
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set the value of firstname
     *
     * @return  self
     */ 
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get the value of lastname
     */ 
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Set the value of lastname
     *
     * @return  self
     */ 
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get the value of email
     */ 
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @return  self
     */ 
    public function setEmail($email)
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Get the value of password
     */ 
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set the value of password
     *
     * @return  self
     */ 
    public function setPassword($password)
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Get the value of roles
     */ 
    public function getRoles(): array
    {
        $rolesArray = explode(",", json_encode($this->roles));
        return $rolesArray;
    }

    /**
     * Set the value of roles
     *
     * @return  self
     */ 
    public function setRoles($roles)
    {
        $this->roles = $roles;

        return $this;
    }
}