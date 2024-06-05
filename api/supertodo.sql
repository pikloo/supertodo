BEGIN;

DROP TABLE IF EXISTS `st_user`,
`st_todo`,
`st_task`,
`st_role`,
`st_user_task`,
`st_user_todo`;

CREATE TABLE IF NOT EXISTS `st_role` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(64) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS `st_user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `firstname` VARCHAR(64),
    `lastname` VARCHAR(64),
    `email` VARCHAR(128) NOT NULL UNIQUE KEY,
    `password` VARCHAR(128) NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    `activation_token` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now(),
    `role_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY (`role_id`) REFERENCES `st_role`(`id`)
);

CREATE TABLE IF NOT EXISTS `st_todo` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(128) NOT NULL,
    `desc` TEXT,
    `user_id` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now(),
    FOREIGN KEY (`user_id`) REFERENCES `st_user` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `st_task` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(128) NOT NULL,
    `status` ENUM('todo', 'doing', 'complete') NOT NULL,
    `todo_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT now(),
    `updated_at` TIMESTAMP NOT NULL DEFAULT now(),
    FOREIGN KEY (`todo_id`) REFERENCES `st_todo` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `st_user` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `st_user_task` (
    `user_id` INT UNSIGNED NOT NULL,
    `task_id` INT UNSIGNED NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `st_user` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`task_id`) REFERENCES `st_task` (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`user_id`, `task_id`)
);

CREATE TABLE IF NOT EXISTS `st_user_todo` (
    `user_id` INT UNSIGNED NOT NULL,
    `todo_id` INT UNSIGNED NOT NULL,
    `role` VARCHAR(64) NOT NULL,
    FOREIGN KEY (`todo_id`)REFERENCES `st_todo` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `st_user` (`id`) ON DELETE CASCADE,
    PRIMARY KEY (`todo_id`, `user_id`)
);

INSERT INTO
    `st_role` (`id`, `title`)
VALUES
    (NULL, 'ROLE_ADMIN'),
    (NULL, 'ROLE_USER');

INSERT INTO
    `st_user` (
        `firstname`,
        `lastname`,
        `email`,
        `password`,
        `role_id`
    )
VALUES
    (
        'pik',
        'loo',
        'p.loukakou@gmail',
        '$2y$10$.CUX6PmatPPlkmcXxZlht.5MoLM1hOgCKw1NMfxbxVeLFT3wbmkwS',
        '1'
    );

COMMIT;