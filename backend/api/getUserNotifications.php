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
    

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get user_id from query parameters
    $user_id = filter_var($_GET['user_id'] ?? null, FILTER_VALIDATE_INT);

    if ($user_id === false || $user_id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Invalid user ID provided."]);
        exit();
    }

    // SQL query to fetch notifications for the given user
    $sql = "SELECT
                notification_id,
                user_id,
                type,
                title,
                message,
                is_read,
                created_at,
                related_data
            FROM
                user_notifications
            WHERE
                user_id = ?
            ORDER BY
                created_at DESC";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $notifications = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            // Decode related_data if it's stored as JSON string
            if ($row['related_data']) {
                $row['related_data'] = json_decode($row['related_data'], true);
            }
            $notifications[] = $row;
        }
        http_response_code(200);
        echo json_encode($notifications);
    } else {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP getUserNotifications Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
