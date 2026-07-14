CREATE DATABASE IF NOT EXISTS treasure_hunt
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE treasure_hunt;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    coins INT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL AFTER username;

CREATE TABLE IF NOT EXISTS quests (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    reward_coins INT UNSIGNED NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS achievements (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id INT UNSIGNED NOT NULL,
    achievement_id INT UNSIGNED NOT NULL,
    unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id),
    CONSTRAINT fk_user_achievements_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_achievements_achievement
        FOREIGN KEY (achievement_id) REFERENCES achievements(id)
        ON DELETE CASCADE
);

INSERT INTO quests (title, description, reward_coins)
SELECT 'Find Lent', 'Go to Lent and discover the first clue by the river.', 25
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Find Lent');

INSERT INTO quests (title, description, reward_coins)
SELECT 'Reach Main Square', 'Visit Maribor Main Square and unlock the next part of the hunt.', 35
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Reach Main Square');

INSERT INTO quests (title, description, reward_coins)
SELECT 'Visit Maribor Castle', 'Explore the castle area and complete the treasure route.', 50
WHERE NOT EXISTS (SELECT 1 FROM quests WHERE title = 'Visit Maribor Castle');

INSERT INTO achievements (title, description)
SELECT 'First Steps', 'Create an account and start the treasure hunt.'
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE title = 'First Steps');

INSERT INTO achievements (title, description)
SELECT 'Explorer', 'Open the quests page and check the available missions.'
WHERE NOT EXISTS (SELECT 1 FROM achievements WHERE title = 'Explorer');