<?php

declare(strict_types=1);

function json_response(array $payload, int $status = 200): void
{
    // Centralize JSON output so every endpoint returns the same content type and exits.
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function read_json_body(): array
{
    // Invalid or empty JSON becomes an empty array, keeping endpoint validation simple.
    $rawBody = file_get_contents('php://input');
    $data = json_decode($rawBody ?: '{}', true);

    return is_array($data) ? $data : [];
}
