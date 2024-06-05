<?php

namespace SuperTodo\Models;

use DateTime;
use IntlDateFormatter;
use IntlTimeZone;
use PDO;
use SuperTodo\Utils\Database;

class User extends CoreModel
{
    private $firstname;

    private $lastname;

    private $email;

    private $password;

    private $role;

    private $role_id;

    private $activation_token;

    private $status;


    public function insert()
    {
        $pdo = Database::getPDO();
        $sql = '
        INSERT INTO st_user(
        `firstname`, `lastname`,`email`,`password`, `role_id`, `activation_token`)
        values (:firstname, :lastname, :email, :password, :role_id, :activation_token)
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':firstname', $this->firstname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':lastname', $this->lastname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':email', $this->email, PDO::PARAM_STR);
        $pdoStatement->bindParam(':password', $this->password, PDO::PARAM_STR);
        $pdoStatement->bindValue(':role_id', $this->getRoleId(), PDO::PARAM_INT);
        $pdoStatement->bindParam(':activation_token', $this->activation_token, PDO::PARAM_LOB);
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
        UPDATE `st_user`
        SET
            `firstname` = :firstname,
            `lastname` = :lastname,
            `email` = :email,
            `password` = :password,
            `role_id` = :role_id,
            `status` = :status,
            `updated_at` = NOW()
        WHERE `id` = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':firstname', $this->firstname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':lastname', $this->lastname, PDO::PARAM_STR);
        $pdoStatement->bindParam(':email', $this->email, PDO::PARAM_STR);
        $pdoStatement->bindParam(':password', $this->password, PDO::PARAM_STR);
        $pdoStatement->bindValue(':role_id', $this->getRoleId(), PDO::PARAM_INT);
        $pdoStatement->bindParam(':id', $this->id, PDO::PARAM_INT);
        $pdoStatement->bindParam(':status', $this->status, PDO::PARAM_STR);
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

    public function delete()
    {
        $pdo = Database::getPDO();
        $sql = '
        DELETE FROM `st_user`
        WHERE id = :id
        ';
        $pdoStatement = $pdo->prepare($sql);
        $pdoStatement->bindParam(':id', $this->id, PDO::PARAM_INT);
        $pdoStatement->execute();
        return ($pdoStatement->rowCount() > 0);
    }


    public function __construct()
    {
        $role_user = Role::findByTitle('ROLE_USER');

        $this->role_id = $role_user->getId();
        $this->role = $role_user->getTitle();
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
        $this->firstname = ucfirst($firstname);

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
        $this->lastname = ucfirst($lastname);

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
     * Get the value of role_id
     */
    public function getRoleId()
    {
        return $this->role_id;
    }

    /**
     * Set the value of role_id
     *
     * @return  self
     */
    public function setRoleId($role_id)
    {
        $this->role_id = $role_id;

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

    /**
     * Get the value of member_since
     */
    public function getMemberSince()
    {
        $formatter = new IntlDateFormatter('fr_FR'
                , IntlDateFormatter::LONG, IntlDateFormatter::LONG, null, null, 'dd MMMM yyyy');

        return datefmt_format($formatter, new DateTime($this->created_at));
    }

    /**
     * Get the value of activation_token
     */ 
    public function getActivationToken()
    {
        return $this->activation_token;
    }

    /**
     * Set the value of activation_token
     *
     * @return  self
     */ 
    public function setActivationToken($activation_token)
    {
        $this->activation_token = $activation_token;

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

    public function getFullName(){
        return $this->getFirstname().''. $this->getLastname();
    }
}
