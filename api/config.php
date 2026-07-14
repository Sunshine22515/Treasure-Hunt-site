<?php

declare(strict_types=1);

// Optional local overrides keep production credentials out of version control.
$localConfigPath = __DIR__ . '/config.local.php';
$localConfig = file_exists($localConfigPath) ? require $localConfigPath : [];

function config_value(string $key, string $default): string
{
    global $localConfig;

    // Prefer config.local.php, then environment variables, then safe local defaults.
    if (isset($localConfig[$key]) && $localConfig[$key] !== '') {
        return (string)$localConfig[$key];
    }

    $value = getenv($key);

    return $value === false || $value === '' ? $default : $value;
}

// Defaults match a standard local XAMPP/MySQL setup.
define('DB_HOST', config_value('DB_HOST', '127.0.0.1'));
define('DB_NAME', config_value('DB_NAME', 'treasure_hunt'));
define('DB_USER', config_value('DB_USER', 'root'));
define('DB_PASS', config_value('DB_PASS', ''));
