<?php

declare(strict_types=1);

require_once __DIR__ . '/config.php';

function db(): PDO
{
    // Reuse one PDO connection per request instead of opening a new one for each query.
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        // Throw exceptions so endpoint code can handle database failures cleanly.
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}
