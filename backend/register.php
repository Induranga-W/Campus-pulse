<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/register.php
 * New student account registration. Role is strictly assigned as 'USER'.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');
$cohort = trim($input['cohort'] ?? 'Batch 26.1 IFSL');

if (empty($name) || empty($email) || empty($password)) {
    send_json_response(['success' => false, 'error' => 'Please provide name, student email, and password.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json_response(['success' => false, 'error' => 'Please provide a valid email address.'], 400);
}

if (strlen($password) < 6) {
    send_json_response(['success' => false, 'error' => 'Password must be at least 6 characters.'], 400);
}

$pdo = get_db_connection();
if (!$pdo) {
    send_json_response(['success' => false, 'error' => 'Database connection is unavailable. Start MySQL and verify backend/config.php.'], 503);
}

$role = 'USER'; // Registration must never allow public users to create admin accounts.
try {
    $checkStmt = $pdo->prepare("SELECT `id` FROM `users` WHERE `email` = :email LIMIT 1");
    $checkStmt->execute(['email' => $email]);
    if ($checkStmt->fetch()) {
        send_json_response(['success' => false, 'error' => 'An account with this email address already exists.'], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
    $insertStmt = $pdo->prepare("INSERT INTO `users` (`name`, `email`, `password`, `role`, `avatar`, `cohort`) VALUES (:name, :email, :password, :role, :avatar, :cohort)");
    $insertStmt->execute([
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => $role,
        'avatar' => $avatar,
        'cohort' => $cohort
    ]);
    $newUserId = (int)$pdo->lastInsertId();
} catch (Throwable $e) {
    error_log("Registration error: " . $e->getMessage());
    send_json_response(['success' => false, 'error' => 'Registration could not be completed. Please try again.'], 500);
}

if (!$newUserId) {
    send_json_response(['success' => false, 'error' => 'Account could not be saved. Please try again.'], 500);
}

// Log in new user automatically
session_regenerate_id(true);
$_SESSION['user_id'] = $newUserId;
$_SESSION['name'] = $name;
$_SESSION['email'] = $email;
$_SESSION['role'] = 'USER';
$_SESSION['avatar'] = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
$_SESSION['cohort'] = $cohort;

send_json_response([
    'success' => true,
    'message' => 'Registration successful! Welcome to NSBM NewsDesk.',
    'user' => [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['name'],
        'email' => $_SESSION['email'],
        'role' => $_SESSION['role'],
        'avatar' => $_SESSION['avatar'],
        'cohort' => $_SESSION['cohort']
    ]
]);
