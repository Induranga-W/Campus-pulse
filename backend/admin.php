<?php
/**
 * NSBM NewsDesk — Campus Pulse
 * backend/admin.php
 * Strictly protected administrator operations endpoint.
 * Requires verified ADMIN session. Rejects normal USER and guest requests.
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// STRICT BACKEND ROLE VERIFICATION: Only authenticated accounts with role 'ADMIN' can proceed
$adminUser = require_admin();

$pdo = get_db_connection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'overview';

    if ($action === 'overview') {
        $newsList = [];
        $pulseList = [];
        $submissions = [];

        if ($pdo) {
            try {
                $newsList = $pdo->query("SELECT * FROM `news_articles` ORDER BY `created_at` DESC")->fetchAll();
                $pulseList = $pdo->query("SELECT * FROM `campus_pulse` ORDER BY `created_at` DESC")->fetchAll();
                $submissions = $pdo->query("SELECT * FROM `submissions` ORDER BY `created_at` DESC")->fetchAll();
            } catch (Exception $e) {
                error_log("Admin overview error: " . $e->getMessage());
            }
        }

        if (empty($newsList)) {
            require_once __DIR__ . '/../data.php';
            $newsList = $news_articles;
            $pulseList = $campus_pulse;
            $submissions = $sample_submissions;
        }

        $pendingSubs = array_values(array_filter($submissions, function($s) {
            return ($s['status'] ?? '') === 'pending';
        }));

        send_json_response([
            'success' => true,
            'admin' => $adminUser,
            'stats' => [
                'total_news' => count($newsList),
                'pending_submissions' => count($pendingSubs),
                'active_pulse' => count($pulseList),
                'total_submissions' => count($submissions)
            ],
            'pending_submissions' => $pendingSubs,
            'recent_news' => array_slice($newsList, 0, 5),
            'news_list' => $newsList,
            'pulse_list' => $pulseList,
            'submissions' => $submissions
        ]);
    }

    send_json_response(['success' => false, 'error' => 'Unknown action.'], 400);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    $action = $input['action'] ?? '';

    // 1. Create News Article
    if ($action === 'create_news') {
        $title = trim($input['title'] ?? '');
        $summary = trim($input['summary'] ?? '');
        $content = trim($input['content'] ?? '');
        $category = trim($input['category'] ?? 'Events');
        $author = trim($input['author'] ?? $adminUser['name']);
        $coverImage = trim($input['cover_image'] ?? './images/hero_innovation_week.jpg');
        $isImportant = !empty($input['is_important']) ? 1 : 0;

        if (empty($title) || empty($summary) || empty($content)) {
            send_json_response(['success' => false, 'error' => 'Title, summary, and content are required.'], 400);
        }

        $artId = 'art-admin-' . time();
        $dateStr = date('F j, Y');

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO `news_articles` 
                    (`id`, `title`, `summary`, `content`, `category`, `cover_image`, `author`, `author_role`, `author_avatar`, `date`, `read_time`, `is_important`, `is_featured`, `views`, `likes`, `tags`)
                    VALUES 
                    (:id, :title, :summary, :content, :category, :img, :author, 'Chief Faculty Editor', :avatar, :date, '3 min read', :imp, :imp, 1, 0, :tags)
                ");
                $stmt->execute([
                    'id' => $artId,
                    'title' => $title,
                    'summary' => $summary,
                    'content' => $content,
                    'category' => $category,
                    'img' => $coverImage,
                    'author' => $author,
                    'avatar' => $adminUser['avatar'],
                    'date' => $dateStr,
                    'imp' => $isImportant,
                    'tags' => $category . ',FacultyAdmin'
                ]);
            } catch (Exception $e) {
                error_log("Create news error: " . $e->getMessage());
            }
        }

        send_json_response([
            'success' => true,
            'message' => "Published \"{$title}\" to live campus feeds.",
            'article_id' => $artId
        ]);
    }

    // 2. Delete News Article
    if ($action === 'delete_news') {
        $artId = trim($input['article_id'] ?? '');
        if (empty($artId)) {
            send_json_response(['success' => false, 'error' => 'Article ID required.'], 400);
        }

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM `news_articles` WHERE `id` = :id");
                $stmt->execute(['id' => $artId]);
            } catch (Exception $e) {
                error_log("Delete news error: " . $e->getMessage());
            }
        }

        send_json_response(['success' => true, 'message' => 'Article deleted successfully.']);
    }

    // 3. Approve Student Submission
    if ($action === 'approve_submission') {
        $subId = trim($input['submission_id'] ?? '');
        if (empty($subId)) {
            send_json_response(['success' => false, 'error' => 'Submission ID required.'], 400);
        }

        $publishedId = 'art-sub-' . time();

        if ($pdo) {
            try {
                // Get submission
                $sStmt = $pdo->prepare("SELECT * FROM `submissions` WHERE `id` = :id LIMIT 1");
                $sStmt->execute(['id' => $subId]);
                $sub = $sStmt->fetch();

                if ($sub) {
                    // Update status
                    $uStmt = $pdo->prepare("UPDATE `submissions` SET `status` = 'approved' WHERE `id` = :id");
                    $uStmt->execute(['id' => $subId]);

                    // Insert as live news article
                    $ins = $pdo->prepare("
                        INSERT INTO `news_articles`
                        (`id`, `title`, `summary`, `content`, `category`, `cover_image`, `author`, `author_role`, `author_avatar`, `date`, `read_time`, `is_important`, `is_featured`, `views`, `likes`, `tags`)
                        VALUES
                        (:id, :title, :summary, :content, :category, :img, :author, 'Campus Student Reporter', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', :date, '3 min read', 0, 0, 1, 0, :tags)
                    ");
                    $ins->execute([
                        'id' => $publishedId,
                        'title' => $sub['title'],
                        'summary' => substr($sub['details'], 0, 150) . '...',
                        'content' => $sub['details'],
                        'category' => $sub['category'],
                        'img' => $sub['cover_image'] ?: './images/hero_innovation_week.jpg',
                        'author' => $sub['student_name'],
                        'date' => date('F j, Y'),
                        'tags' => $sub['category'] . ',StudentReport'
                    ]);
                }
            } catch (Exception $e) {
                error_log("Approve submission error: " . $e->getMessage());
            }
        }

        send_json_response(['success' => true, 'message' => 'Story approved and published to live feeds.']);
    }

    // 4. Create Pulse Activity
    if ($action === 'create_pulse') {
        $title = trim($input['title'] ?? '');
        $description = trim($input['description'] ?? '');
        $location = trim($input['location'] ?? 'NSBM Concourse');
        $time = trim($input['time'] ?? 'Now');
        $status = trim($input['status'] ?? 'upcoming');
        $category = trim($input['category'] ?? 'Technology');

        if (empty($title)) {
            send_json_response(['success' => false, 'error' => 'Title is required.'], 400);
        }

        $pulseId = 'pulse-admin-' . time();

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO `campus_pulse`
                    (`id`, `title`, `description`, `location`, `date`, `start_time`, `end_time`, `status`, `category`, `organizer`, `attendees`)
                    VALUES
                    (:id, :title, :desc, :loc, 'Today', :st, 'TBD', :status, :cat, 'Media Board', 30)
                ");
                $stmt->execute([
                    'id' => $pulseId,
                    'title' => $title,
                    'desc' => $description,
                    'loc' => $location,
                    'st' => $time,
                    'status' => $status,
                    'cat' => $category
                ]);
            } catch (Exception $e) {
                error_log("Create pulse error: " . $e->getMessage());
            }
        }

        send_json_response(['success' => true, 'message' => "Added \"{$title}\" to Campus Pulse Radar."]);
    }

    // 5. Delete Pulse Activity
    if ($action === 'delete_pulse') {
        $pulseId = trim($input['pulse_id'] ?? '');
        if (empty($pulseId)) {
            send_json_response(['success' => false, 'error' => 'Pulse activity ID required.'], 400);
        }

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM `campus_pulse` WHERE `id` = :id");
                $stmt->execute(['id' => $pulseId]);
            } catch (Exception $e) {
                error_log("Delete pulse error: " . $e->getMessage());
            }
        }

        send_json_response(['success' => true, 'message' => 'Activity removed from radar.']);
    }

    // 6. Toggle Pulse Status
    if ($action === 'toggle_pulse') {
        $pulseId = trim($input['pulse_id'] ?? '');
        if (empty($pulseId)) {
            send_json_response(['success' => false, 'error' => 'Pulse activity ID required.'], 400);
        }

        if ($pdo) {
            try {
                $stmt = $pdo->prepare("SELECT `status` FROM `campus_pulse` WHERE `id` = :id LIMIT 1");
                $stmt->execute(['id' => $pulseId]);
                $curr = $stmt->fetchColumn();

                $next = 'upcoming';
                if ($curr === 'upcoming') $next = 'happening_now';
                elseif ($curr === 'happening_now') $next = 'completed';

                $uStmt = $pdo->prepare("UPDATE `campus_pulse` SET `status` = :st WHERE `id` = :id");
                $uStmt->execute(['st' => $next, 'id' => $pulseId]);
            } catch (Exception $e) {
                error_log("Toggle pulse error: " . $e->getMessage());
            }
        }

        send_json_response(['success' => true, 'message' => 'Pulse status updated.']);
    }

    send_json_response(['success' => false, 'error' => 'Invalid action.'], 400);
}
