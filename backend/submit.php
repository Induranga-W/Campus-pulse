<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/submit.php
 * Student campus story submission endpoint.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_response(['success' => false, 'error' => 'Method not allowed.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$name = trim($input['student_name'] ?? '');
$email = trim($input['student_email'] ?? '');
$headline = trim($input['headline'] ?? '');
$category = trim($input['category'] ?? 'Events');
$details = trim($input['details'] ?? '');
$imageUrl = trim($input['image_url'] ?? './images/hero_innovation_week.jpg');

if (empty($name) || empty($email) || empty($headline) || empty($details)) {
    send_json_response(['success' => false, 'error' => 'Please fill in all required fields.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json_response(['success' => false, 'error' => 'Please provide a valid university email address.'], 400);
}

$refId = 'NSBM-SUB-2026-' . rand(1000, 9999);
$subId = 'sub-' . time();
$pdo = get_db_connection();

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            INSERT INTO `submissions` (`id`, `ref_id`, `title`, `student_name`, `student_email`, `category`, `details`, `cover_image`, `status`, `submitted_date`)
            VALUES (:id, :ref, :title, :name, :email, :cat, :details, :img, 'pending', :sub_date)
        ");
        $stmt->execute([
            'id' => $subId,
            'ref' => $refId,
            'title' => $headline,
            'name' => $name,
            'email' => $email,
            'cat' => $category,
            'details' => $details,
            'img' => $imageUrl ?: './images/hero_innovation_week.jpg',
            'sub_date' => date('F j, Y')
        ]);
    } catch (Exception $e) {
        error_log("Submission insertion error: " . $e->getMessage());
    }
}

send_json_response([
    'success' => true,
    'message' => 'Story successfully lodged for NewsDesk editorial review.',
    'ref_id' => $refId,
    'title' => $headline
]);
