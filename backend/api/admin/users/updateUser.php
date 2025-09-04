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
    if (!isset($data['user_id'], $data['full_name'], $data['email'], $data['phone'], $data['role'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
        exit();
    }

    $userId = $conn->real_escape_string($data['user_id']);
    $fullName = $conn->real_escape_string($data['full_name']);
    $email = $conn->real_escape_string($data['email']);
    $phone = $conn->real_escape_string($data['phone']);
    $role = $conn->real_escape_string($data['role']);
    $password = isset($data['password']) && $data['password'] !== '' ? md5($conn->real_escape_string($data['password'])) : null; // Hash if provided

    // Check if the email is already used by another user (excluding the current user being updated)
    $checkEmailSql = "SELECT user_id FROM users WHERE email = ? AND user_id != ?";
    $checkEmailStmt = $conn->prepare($checkEmailSql);
    if ($checkEmailStmt === false) {
        throw new Exception("Failed to prepare email check statement: " . $conn->error);
    }
    $checkEmailStmt->bind_param("si", $email, $userId);
    $checkEmailStmt->execute();
    $checkEmailResult = $checkEmailStmt->get_result();
    if ($checkEmailResult->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["success" => false, "message" => "Email already in use by another user."]);
        exit();
    }
    $checkEmailStmt->close();


    $sql = "UPDATE users SET full_name = ?, email = ?, phone = ?, role = ?";
    $params = [$fullName, $email, $phone, $role];
    $types = "ssss";

    if ($password !== null) {
        $sql .= ", password = ?";
        $params[] = $password;
        $types .= "s";
    }

    $sql .= " WHERE user_id = ?";
    $params[] = $userId;
    $types .= "i"; // 'i' for integer user_id

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    // Use call_user_func_array to bind parameters dynamically
    call_user_func_array([$stmt, 'bind_param'], array_merge([$types], $params));

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "User updated successfully."]);
        } else {
            echo json_encode(["success" => false, "message" => "No changes made or user not found."]);
        }
    } else {
        throw new Exception("Failed to update user: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP updateUser Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
