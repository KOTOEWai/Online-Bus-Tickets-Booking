<?php
// Enable CORS
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
include('../db/BusDb.php');

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // SQL query to fetch reviews along with the username
    // Assumes 'reviews' table has 'user_id', 'rating', 'comment', 'created_at'
    // and 'users' table has 'user_id', 'username'
    $sql = "SELECT *
            FROM
                reviews r
            JOIN
                users u ON r.user_id = u.user_id
            ORDER BY
                r.created_at DESC"; // Order by most recent reviews first

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reviews[] = $row;
        }
        http_response_code(200);
        echo json_encode($reviews);
    } else {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP getReviews Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
