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
    $name = (string)($data['name'] ?? ''); // Corresponds to 'username' in frontend
    $email = (string)($data['email'] ?? '');
    // $phone = (string)($data['phone'] ?? ''); // Uncomment if you add phone to users table

    // Basic validation for required fields
    if ($user_id === 0 || empty($name) || empty($email)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "User ID, name, and email are required."]);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid email format."]);
        exit();
    }

    // Prepare SQL statement to update user information
    // Based on tickets.sql, 'name' and 'email' are the fields in 'users' table.
    $sql_update = "UPDATE users SET full_name = ?, email = ? WHERE user_id = ?";
    // If you add phone to users table, uncomment this:
    // $sql_update = "UPDATE users SET name = ?, email = ?, phone = ? WHERE user_id = ?";

    $stmt_update = $conn->prepare($sql_update);

    if ($stmt_update === false) {
        throw new Exception("Failed to prepare update statement: " . $conn->error);
    }

    // Bind parameters
    $stmt_update->bind_param("ssi", $name, $email, $user_id);
    // If you add phone to users table, uncomment this:
    // $stmt_update->bind_param("sssi", $name, $email, $phone, $user_id);


    // Execute the statement
    if ($stmt_update->execute()) {
        if ($stmt_update->affected_rows > 0) {
            http_response_code(200); // OK
            echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
        } else {
            // No rows affected might mean data was the same, or user_id not found
            http_response_code(200); // Still OK, but inform no changes were made
            echo json_encode(["success" => true, "message" => "No changes detected or user not found."]);
        }
    } else {
        throw new Exception("Failed to update profile: " . $stmt_update->error);
    }

    $stmt_update->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP EditProfile Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
