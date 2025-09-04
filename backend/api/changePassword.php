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

      include '../db/BusDb.php';

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get the raw POST data
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    // Validate and sanitize input
    $user_id = (int)($data['user_id'] ?? 0);
    $current_password = (string)($data['current_password'] ?? '');
    $new_password = (string)($data['new_password'] ?? '');

    // Basic validation for required fields
    if ($user_id === 0 || empty($current_password) || empty($new_password)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "All fields are required."]);
        exit();
    }

    // Validate new password length (should match frontend validation)
    if (strlen($new_password) < 8) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "New password must be at least 8 characters long."]);
        exit();
    }

    // 1. Fetch the user's current hashed password from the database
    $sql_fetch_password = "SELECT password FROM users WHERE user_id = ?";
    $stmt_fetch = $conn->prepare($sql_fetch_password);

    if ($stmt_fetch === false) {
        throw new Exception("Failed to prepare fetch statement: " . $conn->error);
    }

    $stmt_fetch->bind_param("i", $user_id);
    $stmt_fetch->execute();
    $result_fetch = $stmt_fetch->get_result();

    if ($result_fetch->num_rows === 0) {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "User not found."]);
        $stmt_fetch->close();
        $conn->close();
        exit();
    }

    $user = $result_fetch->fetch_assoc();
    $hashed_current_password_in_db = $user['password'];
    $stmt_fetch->close();

      if (md5($current_password) !== $hashed_current_password_in_db) {
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Incorrect current password."]);
        $conn->close();
        exit();
    }

    // 3. Hash the new password using MD5
    // FIX: Changed from password_hash() to md5()
    $hashed_new_password = md5($new_password);

    // 4. Update the password in the database
    $sql_update_password = "UPDATE users SET password = ? WHERE user_id = ?";
    $stmt_update = $conn->prepare($sql_update_password);

    if ($stmt_update === false) {
        throw new Exception("Failed to prepare update statement: " . $conn->error);
    }

    $stmt_update->bind_param("si", $hashed_new_password, $user_id); // 's' for string (hashed password), 'i' for integer (user_id)

    if ($stmt_update->execute()) {
        http_response_code(200); // OK
        echo json_encode(["success" => true, "message" => "Password updated successfully."]);
    } else {
        throw new Exception("Failed to update password: " . $stmt_update->error);
    }

    $stmt_update->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP ChangePassword Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
