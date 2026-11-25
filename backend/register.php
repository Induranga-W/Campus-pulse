<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/register.php
 *
 * Two account types:
 *   student -> role USER,  status active   (signed in straight away)
 *   admin   -> role ADMIN, status pending  (NOT signed in; an existing admin must approve first)
 *
 * The browser only ASKS for a type. The server decides the role and status,
 * so nobody can make themselves an active admin by editing the form.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$isAdmin = (($input['account_type'] ?? 'student') === 'admin');

$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');
$cohort = trim($input['cohort'] ?? '');
if ($cohort === '' && !$isAdmin) {
    $cohort = 'Batch 26.1 IFSL';
}

if (empty($name) || empty($email) || empty($password)) {
    send_json_response(['success' => false, 'error' => 'Please provide name, email, and password.'], 400);
}

if ($isAdmin && $cohort === '') {
    send_json_response(['success' => false, 'error' => 'Please enter your department or position.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json_response(['success' => false, 'error' => 'Please provide a valid email address.'], 400);
}

if (strlen($password) < 6) {
    send_json_response(['success' => false, 'error' => 'Password must be at least 6 characters.'], 400);
}

// Works even if the host has no mbstring extension.
$textLength = function ($v) { return function_exists('mb_strlen') ? mb_strlen($v) : strlen($v); };
if ($textLength($name) > 100 || $textLength($email) > 150 || $textLength($cohort) > 100) {
    send_json_response(['success' => false, 'error' => 'One of the fields is too long.'], 400);
}

$pdo = get_db_connection();
if (!$pdo) {
    send_json_response(['success' => false, 'error' => 'Database connection is unavailable. Start MySQL and verify backend/config.php.'], 503);
}

// Decided here on the server, never taken from the form.
$role = $isAdmin ? 'ADMIN' : 'USER';
$status = $isAdmin ? 'pending' : 'active';

try {
    $checkStmt = $pdo->prepare("SELECT `id` FROM `users` WHERE `email` = :email LIMIT 1");
    $checkStmt->execute(['email' => $email]);
    if ($checkStmt->fetch()) {
        send_json_response(['success' => false, 'error' => 'An account with this email address already exists.'], 409);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
    $insertStmt = $pdo->prepare("INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`, `avatar`, `cohort`) VALUES (:name, :email, :password, :role, :status, :avatar, :cohort)");
    $insertStmt->execute([
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => $role,
        'status' => $status,
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

// Admin requests stop here: no session is created until an admin approves the account.
if ($isAdmin) {
    send_json_response([
        'success' => true,
        'pending' => true,
        'message' => 'Admin request sent. An existing administrator must approve your account before you can sign in.'
    ]);
}

// Students are logged in automatically
session_regenerate_id(true);
$_SESSION['user_id'] = $newUserId;
$_SESSION['name'] = $name;
$_SESSION['email'] = $email;
$_SESSION['role'] = 'USER';
$_SESSION['avatar'] = $avatar;
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
