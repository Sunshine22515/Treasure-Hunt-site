<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/response.php';

// Quests are read-only from the public API.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed.'], 405);
}

// Only active quests are sent to the frontend.
$statement = db()->query(
    'SELECT id, title, description, reward_coins AS rewardCoins
     FROM quests
     WHERE is_active = 1
     ORDER BY id ASC'
);

// Cast numeric fields so JavaScript receives numbers instead of strings.
$quests = array_map(
    static fn (array $quest): array => [
        'id' => (int)$quest['id'],
        'title' => $quest['title'],
        'description' => $quest['description'],
        'rewardCoins' => (int)$quest['rewardCoins'],
    ],
    $statement->fetchAll()
);

json_response(['quests' => $quests]);
