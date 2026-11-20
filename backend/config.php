<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/config.php
 * Application configuration, session initialization, and JSON response utilities.
 */

// Start secure session if not already started
if (session_status() === PHP_SESSION_NONE) {
    // Configure session cookie params for secure modern browsing
    session_set_cookie_params([
        'lifetime' => 86400 * 7, // 7 days
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

// Database credentials - easily configurable for cPanel / shared LAMP hosting
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'nsbm_newsdesk');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// Set timezone to Sri Lanka Standard Time
date_default_timezone_set('Asia/Colombo');

/**
 * Send JSON response and exit cleanly
 */
function send_json_response($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Get current authenticated user array from session, or null
 */
function get_current_user_session() {
    if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['name'] ?? 'Kasun Perera',
            'email' => $_SESSION['email'] ?? 'kasun@students.nsbm.ac.lk',
            'role' => $_SESSION['role'],
            'avatar' => $_SESSION['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            'cohort' => $_SESSION['cohort'] ?? 'Batch 26.1 IFSL'
        ];
    }
    return null;
}

/**
 * Enforce authenticated user requirement
 */
function require_auth() {
    $user = get_current_user_session();
    if (!$user) {
        send_json_response(['success' => false, 'error' => 'Authentication required. Please log in.'], 401);
    }
    return $user;
}

/**
 * Enforce strict ADMIN authorization (Backend Role Verification)
 */
function require_admin() {
    $user = get_current_user_session();
    if (!$user) {
        send_json_response(['success' => false, 'error' => 'Authentication required.'], 401);
    }
    if ($user['role'] !== 'ADMIN') {
        send_json_response(['success' => false, 'error' => 'Access denied. Administrator privileges required.'], 403);
    }
    return $user;
}
