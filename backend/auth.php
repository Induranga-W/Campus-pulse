<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/auth.php
 * Session validation and current user status endpoint.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$user = get_current_user_session();

if ($user) {
    send_json_response([
        'authenticated' => true,
        'user' => $user
    ]);
} else {
    send_json_response([
        'authenticated' => false,
        'user' => null
    ]);
}
