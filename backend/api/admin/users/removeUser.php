<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');
header("Content-Type: application/json; charset=UTF-8");

// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
// --- End Error Handling Configuration ---

try {
    // Check if the database connection was successful
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    $data = json_decode(file_get_contents("php://input"), true);

    // Validate input
    if (!isset($data['user_id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID is required."]);
        exit();
    }

    $userId = $conn->real_escape_string($data['user_id']);

    $sql = "DELETE FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("i", $userId); // 'i' for integer

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "User deleted successfully."]);
        } else {
            http_response_code(404); // Not Found
            echo json_encode(["success" => false, "message" => "User not found or already deleted."]);
        }
    } else {
        throw new Exception("Failed to delete user: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP deleteUser Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
