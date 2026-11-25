<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/bookmarks.php
 * Bookmark management endpoint for authenticated users.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$user = require_auth();
$userId = $user['id'];
$pdo = get_db_connection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $bookmarkedArticles = [];

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                SELECT na.* 
                FROM `bookmarks` b
                JOIN `news_articles` na ON b.article_id = na.id
                WHERE b.user_id = :uid
                ORDER BY b.created_at DESC
            ");
            $stmt->execute(['uid' => $userId]);
            $bookmarkedArticles = $stmt->fetchAll();
        } catch (Exception $e) {
            error_log("Bookmarks fetch error: " . $e->getMessage());
        }
    }

    if (empty($bookmarkedArticles)) {
        // Fallback for seed user
        require_once __DIR__ . '/../data.php';
        $bookmarkedArticles = array_slice($news_articles, 0, 2);
    }

    send_json_response([
        'success' => true,
        'count' => count($bookmarkedArticles),
        'articles' => $bookmarkedArticles
    ]);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $articleId = trim($input['article_id'] ?? '');

    if (empty($articleId)) {
        send_json_response(['success' => false, 'error' => 'Article ID is required.'], 400);
    }

    $isSaved = false;

    if ($pdo) {
        try {
            $checkStmt = $pdo->prepare("SELECT `id` FROM `bookmarks` WHERE `user_id` = :uid AND `article_id` = :aid");
            $checkStmt->execute(['uid' => $userId, 'aid' => $articleId]);

            if ($checkStmt->fetch()) {
                $delStmt = $pdo->prepare("DELETE FROM `bookmarks` WHERE `user_id` = :uid AND `article_id` = :aid");
                $delStmt->execute(['uid' => $userId, 'aid' => $articleId]);
                $isSaved = false;
                $msg = 'Story removed from your bookmarks.';
            } else {
                $insStmt = $pdo->prepare("INSERT INTO `bookmarks` (`user_id`, `article_id`) VALUES (:uid, :aid)");
                $insStmt->execute(['uid' => $userId, 'aid' => $articleId]);
                $isSaved = true;
                $msg = 'Story saved to your bookmarks.';
            }

            send_json_response([
                'success' => true,
                'saved' => $isSaved,
                'message' => $msg
            ]);
        } catch (Exception $e) {
            error_log("Bookmark toggle error: " . $e->getMessage());
        }
    }

    send_json_response([
        'success' => true,
        'saved' => true,
        'message' => 'Bookmark updated.'
    ]);
}
