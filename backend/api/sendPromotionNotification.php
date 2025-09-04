<?php
include('./cors.php');
include '../db/BusDb.php';

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');

header('Content-Type: application/json; charset=utf-8');

try {
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Parse JSON input
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);

    // Inputs
    $title   = trim((string)($data['title'] ?? ''));
    $message = trim((string)($data['message'] ?? ''));
    
    $adminId = (int)($data['admin_user_id'] ?? 0);
    // Send to one user if > 0; send to all users if 0 or missing.
    $targetUserId = isset($data['target_user_id']) ? (int)$data['target_user_id'] : 0;
    $type   = (string)($data['type'] ?? 'promotion'); // e.g., promotion | booking | reminder

    // Basic validation
    if ($title === '' || $message === '' || $adminId === 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "title, message, and admin_user_id are required."]);
        exit();
    }

    // Optional: verify admin role here...

    // Collect user IDs
    $userIds = [];

    if ($targetUserId > 0) {
        // ✅ PREPARED SELECT (DO NOT use ->query() with '?')
        $sel = $conn->prepare("SELECT user_id FROM users WHERE user_id = ?");
        if (!$sel) throw new Exception("Prepare failed (select one): " . $conn->error);
        $sel->bind_param("i", $targetUserId);
        $sel->execute();

        // Use bind_result to avoid mysqlnd dependency
        $sel->bind_result($uid);
        while ($sel->fetch()) {
            $userIds[] = (int)$uid;
        }
        $sel->close();
    } else {
        // All users (no placeholders, so a normal query is fine)
        $rs = $conn->query("SELECT user_id FROM users");
        if (!$rs) throw new Exception("Failed to fetch users: " . $conn->error);
        while ($row = $rs->fetch_assoc()) {
            $userIds[] = (int)$row['user_id'];
        }
        $rs->free();
    }

    if (empty($userIds)) {
        echo json_encode(["success" => true, "message" => "No users found to notify."]);
        exit();
    }

    // Insert notifications in a transaction
    $txStarted = false;
    if (!$conn->begin_transaction()) {
        throw new Exception("Failed to start transaction: " . $conn->error);
    }
    $txStarted = true;

    $ins = $conn->prepare("
        INSERT INTO user_notifications (user_id, type, title, message, is_read, created_at)
        VALUES (?, ?, ?, ?, 0, NOW())
    ");
    if (!$ins) throw new Exception("Prepare failed (insert): " . $conn->error);

    // user_id=int, type=string, title=string, message=string
    foreach ($userIds as $uidVal) {
        $ins->bind_param("isss", $uidVal, $type, $title, $message);
        if (!$ins->execute()) {
            throw new Exception("Insert failed for user_id {$uidVal}: " . $ins->error);
        }
    }

    $ins->close();
    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Notifications sent.",
        "count"   => count($userIds),
        "target"  => ($targetUserId > 0 ? "single_user" : "all_users")
    ]);

} catch (Exception $e) {
    // Try rollback if we started a transaction
    if (isset($txStarted) && $txStarted) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("sendPromotionNotification Error: " . $e->getMessage());
} finally {
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
