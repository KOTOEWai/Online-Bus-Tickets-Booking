<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');
header("Content-Type: application/json; charset=UTF-8");

try {
    // Check if the database connection was successful
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    $sql = "SELECT user_id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $users = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        echo json_encode($users);
    } else {
        throw new Exception("Error fetching users: " . $conn->error);
    }

    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP readUsers Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
