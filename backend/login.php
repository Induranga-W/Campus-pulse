<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/login.php
 * Authentication endpoint with role-based session assignment.
 *
 * The Student / Admin toggle on the login page is only a hint. The server checks
 * the role and status stored in the database before it opens a session.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// Accept JSON input or standard POST
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');
// 'student' or 'admin' from the login toggle. Old pages that send nothing skip the tab check.
$accountType = $input['account_type'] ?? '';

if (empty($email) || empty($password)) {
    send_json_response(['success' => false, 'error' => 'Please provide both email and password.'], 400);
}

$pdo = get_db_connection();
if (!$pdo) {
    send_json_response(['success' => false, 'error' => 'Database connection is unavailable. Start MySQL and verify backend/config.php.'], 503);
}

$userFound = null;
try {
    $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `email` = :email LIMIT 1");
    $stmt->execute(['email' => $email]);
    $row = $stmt->fetch();
    if ($row && password_verify($password, $row['password'])) {
        $userFound = $row;
    }
} catch (Throwable $e) {
    error_log("Login query error: " . $e->getMessage());
    send_json_response(['success' => false, 'error' => 'A server error occurred while signing in.'], 500);
}

if (!$userFound) {
    send_json_response(['success' => false, 'error' => 'Invalid email address or password.'], 401);
}

// The password is correct from here on, so it is safe to explain what is wrong with the account.
$status = $userFound['status'] ?? 'active';
if ($status === 'pending') {
    send_json_response(['success' => false, 'error' => 'Your admin account is waiting for approval from an existing administrator.'], 403);
}
if ($status === 'rejected') {
    send_json_response(['success' => false, 'error' => 'Your admin request was not approved. Please contact an administrator.'], 403);
}

$isAdminAccount = ($userFound['role'] === 'ADMIN');
if ($accountType === 'admin' && !$isAdminAccount) {
    send_json_response(['success' => false, 'error' => 'This is a student account. Switch to the Student tab to sign in.'], 403);
}
if ($accountType === 'student' && $isAdminAccount) {
    send_json_response(['success' => false, 'error' => 'This is an admin account. Switch to the Admin tab to sign in.'], 403);
}

// Regenerate session ID on privilege elevation to prevent fixation
session_regenerate_id(true);

$_SESSION['user_id'] = $userFound['id'];
$_SESSION['name'] = $userFound['name'];
$_SESSION['email'] = $userFound['email'];
$_SESSION['role'] = $userFound['role']; // Strict 'USER' or 'ADMIN'
$_SESSION['avatar'] = $userFound['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
$_SESSION['cohort'] = $userFound['cohort'] ?? 'Batch 26.1 IFSL';

send_json_response([
    'success' => true,
    'message' => 'Logged in successfully.',
    'user' => [
        'id' => $_SESSION['user_id'],
        'name' => $_SESSION['name'],
        'email' => $_SESSION['email'],
        'role' => $_SESSION['role'],
        'avatar' => $_SESSION['avatar'],
        'cohort' => $_SESSION['cohort']
    ]
]);
