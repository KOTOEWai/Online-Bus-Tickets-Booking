<?php
include('./cors.php');
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
    // Adjust the path if your BusDb.php is located elsewhere relative to this file
    include ('../db/BusDb.php');

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get user_id from GET parameters
    $user_id = filter_var($_GET['user_id'] ?? null, FILTER_SANITIZE_STRING);

    if (empty($user_id)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID is required."]);
        exit();
    }

    // Prepare SQL statement to fetch user information
    // Assuming your 'users' table has columns like user_id, name, email, phone, role.
    // Adjust column names if they are different in your 'users' table.
    $sql = "SELECT user_id, full_name, email, phone, role FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->bind_param("s", $user_id); // 's' for string, assuming user_id is a string/varchar

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userInfo = $result->fetch_assoc();
        http_response_code(200);
        echo json_encode($userInfo);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "User not found."]);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP getUserInfo Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
