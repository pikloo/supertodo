BEGIN;

DROP TABLE IF EXISTS `st_user`,
`st_todo`,
`st_task`,
`st_user_task`,
`st_user_todo`;

CREATE TABLE IF NOT EXISTS `st_user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(64),
    `lastname` VARCHAR(64),
    `email` VARCHAR(128) NOT NULL UNIQUE KEY,
    `password` VARCHAR(128) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS `st_todo` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(128) NOT NULL,
    `desc` TEXT,
    `user_id` INT NOT NULL REFERENCES `st_user` (`id`) ON DELETE CASCADE,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS `st_task` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(128) NOT NULL,
    `status` ENUM('todo', 'doing', 'done') NOT NULL,
    `todo_id` INT NOT NULL REFERENCES `st_todo` (`id`) ON DELETE CASCADE,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS `st_user_task` (
    `user_id` INT NOT NULL REFERENCES `st_user` (`id`) ON DELETE CASCADE,
    `task_id` INT NOT NULL REFERENCES `st_task` (`id`) ON DELETE CASCADE,
  	PRIMARY KEY (`user_id`,`task_id`)
);

CREATE TABLE IF NOT EXISTS `st_user_todo` (
    `todo_id` INT NOT NULL REFERENCES `st_todo` (`id`) ON DELETE CASCADE,
    `user_id` INT NOT NULL REFERENCES `st_user` (`id`) ON DELETE CASCADE,
    `role` JSON NOT NULL,
  	PRIMARY KEY (`todo_id`,`user_id`)
);

COMMIT;