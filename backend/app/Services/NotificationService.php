<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public static function create(int $userId, string $type, array $data): void
    {
        Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'data' => $data,
        ]);
    }
}
