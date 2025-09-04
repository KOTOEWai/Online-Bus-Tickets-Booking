<?php
// Enable CORS (Cross-Origin Resource Sharing)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0); // DO NOT display errors in the browser for production.
ini_set('log_errors', 1);    // Log errors to the PHP error log file.
ini_set('error_log', __DIR__ . '/php-error.log'); // Specify a log file path.
// --- End Error Handling Configuration ---

try {
    // Include your database connection file
    // Corrected path: assuming BusDb.php is directly inside the 'db' folder,
    // and this PHP file is in 'backend/api/'
    include('../../db/BusDb.php');

    // Check if the database connection was successful
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Decode the JSON data sent from the frontend
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate and sanitize input
    $name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $message = filter_var($data['message'] ?? '', FILTER_SANITIZE_STRING);

    // Basic validation
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Name, email, and message are required."]);
        exit();
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Invalid email format."]);
        exit();
    }

    // Prepare SQL statement to insert data (removed 'subject' column)
    $sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param("sss", $name, $email, $message);

    // Execute the statement
    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(["success" => true, "message" => "Contact message sent successfully.", "id" => $conn->insert_id]);
    } else {
        throw new Exception("Failed to insert contact message: " . $stmt->error);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP createContact Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
