<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/response.php';

// Achievements are read-only from the public API.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed.'], 405);
}

// Missing or invalid user IDs simply return an empty list for a friendlier UI.
$userId = isset($_GET['userId']) ? (int)$_GET['userId'] : 0;

if ($userId <= 0) {
    json_response(['achievements' => []]);
}

// Join the pivot table to return only achievements unlocked by this user.
$statement = db()->prepare(
    'SELECT a.title, a.description, ua.unlocked_at AS unlockedAt
     FROM achievements a
     INNER JOIN user_achievements ua ON ua.achievement_id = a.id
     WHERE ua.user_id = :user_id
     ORDER BY ua.unlocked_at DESC'
);
$statement->execute(['user_id' => $userId]);

json_response(['achievements' => $statement->fetchAll()]);
