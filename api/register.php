<?php

declare(strict_types=1);

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/response.php';

// Registration only accepts JSON POST requests from the sign-up form.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['error' => 'Method not allowed.'], 405);
}

// Read and normalize incoming credentials before validation.
$data = read_json_body();
$username = trim((string)($data['username'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($username === '' || mb_strlen($username) > 50) {
    json_response(['error' => 'Choose a username between 1 and 50 characters.'], 422);
}

if (strlen($password) < 6) {
    json_response(['error' => 'Choose a password with at least 6 characters.'], 422);
}

try {
    $pdo = db();

    // Keep the project limited to five accounts for testing/demo use.
    $userCount = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($userCount >= 5) {
        json_response(['error' => 'Account limit reached. Only 5 accounts can be created.'], 403);
    }

    // Store a password hash, never the plain text password.
    $statement = $pdo->prepare(
        'INSERT INTO users (username, password_hash) VALUES (:username, :password_hash)'
    );
    $statement->execute([
        'username' => $username,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
    ]);

    json_response([
        'player' => [
            'id' => (int)$pdo->lastInsertId(),
            'name' => $username,
            'coins' => 0,
            'loggedIn' => true,
            'achievements' => [],
        ],
    ], 201);
} catch (PDOException $exception) {
    // MySQL returns 23000 for duplicate unique keys, including username collisions.
    if ($exception->getCode() === '23000') {
        json_response(['error' => 'That username is already taken.'], 409);
    }

    json_response(['error' => 'Could not create account.'], 500);
}
