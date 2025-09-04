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
    if (!isset($data['full_name'], $data['email'], $data['password'], $data['phone'], $data['role'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
        exit();
    }

    $fullName = $conn->real_escape_string($data['full_name']);
    $email = $conn->real_escape_string($data['email']);
    $password = md5($conn->real_escape_string($data['password'])); // IMPORTANT: Use stronger hashing like password_hash() in production!
    $phone = $conn->real_escape_string($data['phone']);
    $role = $conn->real_escape_string($data['role']);

    // Check if email already exists
    $checkSql = "SELECT user_id FROM users WHERE email = ?";
    $checkStmt = $conn->prepare($checkSql);
    if ($checkStmt === false) {
        throw new Exception("Failed to prepare check statement: " . $conn->error);
    }
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if ($checkResult->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["success" => false, "message" => "Email already registered."]);
        exit();
    }
    $checkStmt->close();


    $sql = "INSERT INTO users (full_name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }

    $stmt->bind_param("sssss", $fullName, $email, $password, $phone, $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User created successfully.", "user_id" => $conn->insert_id]);
    } else {
        throw new Exception("Failed to create user: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP createUser Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
