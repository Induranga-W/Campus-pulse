<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/news.php
 * News and articles API endpoint: fetching, searching, single story view, comments, and likes.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$pdo = get_db_connection();

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;

    if ($id) {
        // Return single article detail + comments
        $article = null;
        $comments = [];

        if ($pdo) {
            try {
                // Increment view count
                $upStmt = $pdo->prepare("UPDATE `news_articles` SET `views` = `views` + 1 WHERE `id` = :id");
                $upStmt->execute(['id' => $id]);

                $stmt = $pdo->prepare("SELECT * FROM `news_articles` WHERE `id` = :id LIMIT 1");
                $stmt->execute(['id' => $id]);
                $article = $stmt->fetch();

                if ($article) {
                    $cStmt = $pdo->prepare("SELECT * FROM `comments` WHERE `article_id` = :id ORDER BY `created_at` DESC");
                    $cStmt->execute(['id' => $id]);
                    $comments = $cStmt->fetchAll();
                }
            } catch (Exception $e) {
                error_log("News detail error: " . $e->getMessage());
            }
        }

        if (!$article) {
            // Fallback from data.php
            require_once __DIR__ . '/../data.php';
            foreach ($news_articles as $art) {
                if ($art['id'] === $id) {
                    $article = $art;
                    break;
                }
            }
            if ($article && isset($article_comments[$id])) {
                $comments = $article_comments[$id];
            }
        }

        if (!$article) {
            send_json_response(['success' => false, 'error' => 'Article not found.'], 404);
        }

        send_json_response([
            'success' => true,
            'article' => $article,
            'comments' => $comments
        ]);
    }

    // List all articles with optional filters
    $category = $_GET['category'] ?? 'All';
    $search = trim($_GET['search'] ?? '');
    $sort = $_GET['sort'] ?? 'newest';

    $articles = [];

    if ($pdo) {
        try {
            $sql = "SELECT * FROM `news_articles` WHERE 1=1";
            $params = [];

            if ($category !== 'All' && $category !== 'all-news' && $category !== 'for-you') {
                $sql .= " AND LOWER(`category`) = LOWER(:cat)";
                $params['cat'] = $category;
            }

            if (!empty($search)) {
                $sql .= " AND (LOWER(`title`) LIKE :q OR LOWER(`summary`) LIKE :q OR LOWER(`content`) LIKE :q)";
                $params['q'] = '%' . strtolower($search) . '%';
            }

            if ($sort === 'popular') {
                $sql .= " ORDER BY `views` DESC, `created_at` DESC";
            } else {
                $sql .= " ORDER BY `created_at` DESC";
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $articles = $stmt->fetchAll();
        } catch (Exception $e) {
            error_log("News list query error: " . $e->getMessage());
        }
    }

    if (empty($articles)) {
        // Fallback from data.php
        require_once __DIR__ . '/../data.php';
        $articles = $news_articles;
        if ($category !== 'All' && $category !== 'all-news' && $category !== 'for-you') {
            $articles = array_filter($articles, function($a) use ($category) {
                return strcasecmp($a['category'], $category) === 0;
            });
        }
        if (!empty($search)) {
            $articles = array_filter($articles, function($a) use ($search) {
                return stripos($a['title'], $search) !== false || stripos($a['summary'], $search) !== false;
            });
        }
        if ($sort === 'popular') {
            usort($articles, function($a, $b) {
                return ($b['views'] ?? 0) - ($a['views'] ?? 0);
            });
        }
        $articles = array_values($articles);
    }

    send_json_response([
        'success' => true,
        'count' => count($articles),
        'articles' => $articles
    ]);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $action = $input['action'] ?? '';
    $articleId = $input['article_id'] ?? '';

    if (empty($articleId)) {
        send_json_response(['success' => false, 'error' => 'Article ID is required.'], 400);
    }

    if ($action === 'like') {
        $user = get_current_user_session();
        $userId = $user ? $user['id'] : 0;
        $newLikes = 0;

        if ($pdo) {
            try {
                // If user is logged in, record in likes table
                if ($userId) {
                    $lStmt = $pdo->prepare("SELECT `id` FROM `likes` WHERE `user_id` = :uid AND `article_id` = :aid");
                    $lStmt->execute(['uid' => $userId, 'aid' => $articleId]);
                    if ($lStmt->fetch()) {
                        $pdo->prepare("DELETE FROM `likes` WHERE `user_id` = :uid AND `article_id` = :aid")
                            ->execute(['uid' => $userId, 'aid' => $articleId]);
                        $pdo->prepare("UPDATE `news_articles` SET `likes` = GREATEST(0, `likes` - 1) WHERE `id` = :aid")
                            ->execute(['aid' => $articleId]);
                        $liked = false;
                    } else {
                        $pdo->prepare("INSERT INTO `likes` (`user_id`, `article_id`) VALUES (:uid, :aid)")
                            ->execute(['uid' => $userId, 'aid' => $articleId]);
                        $pdo->prepare("UPDATE `news_articles` SET `likes` = `likes` + 1 WHERE `id` = :aid")
                            ->execute(['aid' => $articleId]);
                        $liked = true;
                    }
                } else {
                    $pdo->prepare("UPDATE `news_articles` SET `likes` = `likes` + 1 WHERE `id` = :aid")
                        ->execute(['aid' => $articleId]);
                    $liked = true;
                }

                $cStmt = $pdo->prepare("SELECT `likes` FROM `news_articles` WHERE `id` = :aid");
                $cStmt->execute(['aid' => $articleId]);
                $newLikes = $cStmt->fetchColumn() ?: 1;
            } catch (Exception $e) {
                error_log("Like error: " . $e->getMessage());
            }
        }

        send_json_response(['success' => true, 'liked' => $liked ?? true, 'likes' => $newLikes]);
    }

    if ($action === 'comment') {
        $commentText = trim($input['text'] ?? '');
        if (empty($commentText)) {
            send_json_response(['success' => false, 'error' => 'Comment text cannot be empty.'], 400);
        }

        $user = get_current_user_session();
        $authorName = $user ? $user['name'] : trim($input['name'] ?? 'Kasun Perera');
        $authorRole = $user ? ($user['cohort'] ?? 'Student') : trim($input['role'] ?? 'Batch 26.1 IFSL');
        $userId = $user ? $user['id'] : null;

        if ($pdo) {
            try {
                $cStmt = $pdo->prepare("INSERT INTO `comments` (`article_id`, `user_id`, `name`, `role`, `text`) VALUES (:aid, :uid, :name, :role, :txt)");
                $cStmt->execute([
                    'aid' => $articleId,
                    'uid' => $userId,
                    'name' => $authorName,
                    'role' => $authorRole,
                    'txt' => $commentText
                ]);
            } catch (Exception $e) {
                error_log("Comment error: " . $e->getMessage());
            }
        }

        send_json_response([
            'success' => true,
            'message' => 'Comment posted successfully.',
            'comment' => [
                'name' => $authorName,
                'role' => $authorRole,
                'text' => $commentText,
                'time' => 'Just now'
            ]
        ]);
    }

    send_json_response(['success' => false, 'error' => 'Invalid action.'], 400);
}
