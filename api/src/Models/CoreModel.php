<?php

namespace SuperTodo\Models;

abstract class CoreModel {
    protected $id;
    protected $created_at;
    protected $updated_at;

    /**
     * Méthode permettant de sauvegarder un Model (insert ou update)
     * 
     * @return bool
     */
    public function save() {
        // si le Model existe déjà (id > 0)
        if ($this->id > 0) {
            // Alors on met à jour
            return $this->update();
        }
        else {
            return $this->insert();
        }
    }

    protected abstract function insert();
    protected abstract function update();

    /**
     * Get the value of id
     */ 
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get the value of created_at
     */ 
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * Set the value of created_at
     *
     * @return  self
     */ 
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * Get the value of updated_at
     */ 
    public function getUpdatedAt()
    {
        return $this->updated_at;
    }

    /**
     * Set the value of updated_at
     *
     * @return  self
     */ 
    public function setUpdatedAt($updated_at)
    {
        $this->updated_at = $updated_at;

        return $this;
    }
}