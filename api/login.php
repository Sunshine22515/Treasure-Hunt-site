<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/response.php';

// Login only accepts JSON POST requests from the login form.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed.'], 405);
}

// Read and normalize incoming credentials before checking the database.
$data = read_json_body();
$username = trim((string)($data['username'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($username === '') {
    json_response(['error' => 'Username is required.'], 422);
}

if ($password === '') {
    json_response(['error' => 'Password is required.'], 422);
}

$statement = db()->prepare('SELECT id, username, password_hash, coins FROM users WHERE username = :username LIMIT 1');
$statement->execute(['username' => $username]);
$user = $statement->fetch();

// password_verify compares the submitted password with the stored hash.
if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'Invalid username or password.'], 401);
}

// Return achievement titles with the player payload so the frontend can cache them.
$achievements = db()
    ->prepare(
        'SELECT a.title
         FROM achievements a
         INNER JOIN user_achievements ua ON ua.achievement_id = a.id
         WHERE ua.user_id = :user_id
         ORDER BY ua.unlocked_at DESC'
    );
$achievements->execute(['user_id' => $user['id']]);

json_response([
    'player' => [
        'id' => (int)$user['id'],
        'name' => $user['username'],
        'coins' => (int)$user['coins'],
        'loggedIn' => true,
        'achievements' => array_column($achievements->fetchAll(), 'title'),
    ],
]);
