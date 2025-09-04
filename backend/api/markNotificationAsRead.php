<?php
include('./cors.php');

session_start();
include '../db/BusDb.php';
// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
// --- End Error Handling Configuration ---

try {
    // Include your database connection file
   

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get the raw POST data
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    // Validate and sanitize input
    $notification_id = filter_var($data['notification_id'] ?? null, FILTER_VALIDATE_INT);
    $user_id = filter_var($data['user_id'] ?? null, FILTER_VALIDATE_INT); // To ensure user owns the notification

    if ($notification_id === false || $notification_id <= 0 || $user_id === false || $user_id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Invalid notification ID or user ID provided."]);
        exit();
    }

    // Update the notification status to is_read = TRUE
    // IMPORTANT: Add user_id to WHERE clause to prevent users from marking others' notifications as read
    $sql = "UPDATE user_notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->bind_param("ii", $notification_id, $user_id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            http_response_code(200); // OK
            echo json_encode(["success" => true, "message" => "Notification marked as read."]);
        } else {
            http_response_code(404); // Not Found or Already Read
            echo json_encode(["success" => false, "message" => "Notification not found or already marked as read."]);
        }
    } else {
        throw new Exception("Failed to update notification status: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP markNotificationAsRead Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
