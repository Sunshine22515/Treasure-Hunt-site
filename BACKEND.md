# Treasure Hunt Backend

This project now uses a small PHP + MySQL backend.

## Database

The database is named `treasure_hunt`.

To recreate it manually:

```powershell
C:\xampp\mysql\bin\mysql.exe -u root -e "source C:/Users/gonca/Downloads/TresureHunt/database/schema.sql"
```

## Online Database Config

For hosting, create this file:

```text
api/config.local.php
```

Use `api/config.local.example.php` as the template and fill it with the database details from your hosting provider:

```php
<?php

declare(strict_types=1);

return [
    'DB_HOST' => 'your_database_host',
    'DB_NAME' => 'your_database_name',
    'DB_USER' => 'your_database_user',
    'DB_PASS' => 'your_database_password',
];
```

`api/config.local.php` is ignored by Git so real passwords do not get committed.

## Local Server

Run the project with PHP's local server:

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8020 -t C:\Users\gonca\Downloads\TresureHunt
```

Then open:

```text
http://127.0.0.1:8020/index.html
```

## API Endpoints

- `POST api/register.php` with `{ "username": "PlayerName", "password": "secret123" }`
- `POST api/login.php` with `{ "username": "PlayerName", "password": "secret123" }`
- `GET api/quests.php`
- `GET api/leaderboard.php`
- `GET api/achievements.php?userId=1`
