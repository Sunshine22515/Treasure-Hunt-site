<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/response.php';

// Leaderboard is read-only and ordered by highest coin count first.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['error' => 'Method not allowed.'], 405);
}

$statement = db()->query(
    'SELECT username AS name, coins
     FROM users
     ORDER BY coins DESC, username ASC
     LIMIT 10'
);

// Cast coins to an integer so the frontend can sort/display consistently if needed.
$players = array_map(
    static fn (array $player): array => [
        'name' => $player['name'],
        'coins' => (int)$player['coins'],
    ],
    $statement->fetchAll()
);

json_response(['players' => $players]);
