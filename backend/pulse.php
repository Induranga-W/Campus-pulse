<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/pulse.php
 * Campus Pulse real-time radar endpoint.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$pdo = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status = $_GET['status'] ?? 'all';
    $items = [];

    if ($pdo) {
        try {
            if ($status !== 'all') {
                $stmt = $pdo->prepare("SELECT * FROM `campus_pulse` WHERE `status` = :st ORDER BY `created_at` DESC");
                $stmt->execute(['st' => $status]);
            } else {
                $stmt = $pdo->query("SELECT * FROM `campus_pulse` ORDER BY `created_at` DESC");
            }
            $items = $stmt->fetchAll();
        } catch (Exception $e) {
            error_log("Pulse query error: " . $e->getMessage());
        }
    }

    if (empty($items)) {
        require_once __DIR__ . '/../data.php';
        $items = $campus_pulse;
        if ($status !== 'all') {
            $items = array_values(array_filter($items, function($p) use ($status) {
                return $p['status'] === $status;
            }));
        }
    }

    send_json_response([
        'success' => true,
        'count' => count($items),
        'items' => $items
    ]);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $pulseId = trim($input['pulse_id'] ?? '');

    if (empty($pulseId)) {
        send_json_response(['success' => false, 'error' => 'Pulse activity ID is required.'], 400);
    }

    $user = get_current_user_session();
    $userId = $user ? $user['id'] : 0;
    $hasReminder = false;

    if ($pdo && $userId) {
        try {
            $checkStmt = $pdo->prepare("SELECT `id` FROM `pulse_reminders` WHERE `user_id` = :uid AND `pulse_id` = :pid");
            $checkStmt->execute(['uid' => $userId, 'pid' => $pulseId]);

            if ($checkStmt->fetch()) {
                $pdo->prepare("DELETE FROM `pulse_reminders` WHERE `user_id` = :uid AND `pulse_id` = :pid")
                    ->execute(['uid' => $userId, 'pid' => $pulseId]);
                $hasReminder = false;
                $msg = 'Reminder removed.';
            } else {
                $pdo->prepare("INSERT INTO `pulse_reminders` (`user_id`, `pulse_id`) VALUES (:uid, :pid)")
                    ->execute(['uid' => $userId, 'pid' => $pulseId]);
                $hasReminder = true;
                $msg = 'Reminder set successfully.';
            }

            send_json_response([
                'success' => true,
                'reminder_set' => $hasReminder,
                'message' => $msg
            ]);
        } catch (Exception $e) {
            error_log("Reminder toggle error: " . $e->getMessage());
        }
    }

    send_json_response([
        'success' => true,
        'reminder_set' => true,
        'message' => 'Reminder updated.'
    ]);
}
