
<?php
include('./cors.php'); // Assuming this handles CORS setup

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
    // Adjust the path if your BusDb.php is located elsewhere relative to this file
    include('../db/BusDb.php');

    // Check if the database connection was successful
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get the raw POST data
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    // Validate and sanitize input
    $booking_id = filter_var($data['booking_id'] ?? null, FILTER_VALIDATE_INT);
    $name = (string)($data['name'] ?? ''); // FIX: Replaced FILTER_SANITIZE_STRING
    $genderType = (string)($data['genderType'] ?? ''); // FIX: Changed variable name to genderType and replaced FILTER_SANITIZE_STRING
    $phone = (string)($data['phone'] ?? ''); // FIX: Replaced FILTER_SANITIZE_STRING
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $special_request = (string)($data['special_request'] ?? ''); // FIX: Replaced FILTER_SANITIZE_STRING

    // Basic validation for required fields
    if (empty($booking_id) || empty($name) || empty($genderType) || empty($phone)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "error" => "Required fields (booking ID, name, gender type, phone) are missing or invalid."]);
        exit();
    }

    // Prepare SQL statement to insert data into the 'travellerinfo' table
    // FIX: Changed 'gender' column to 'genderType'
    $sql = "INSERT INTO travellerinfo (booking_id, name, genderType, phone, email, special_request) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters
    // "isssss" -> i for integer (booking_id), s for string (name, genderType, phone, email, special_request)
    $stmt->bind_param("isssss", $booking_id, $name, $genderType, $phone, $email, $special_request);

    // Execute the statement
    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(["success" => true, "message" => "Traveller information saved successfully.", "traveller_id" => $conn->insert_id]);
    } else {
        throw new Exception("Failed to insert traveller information: " . $stmt->error);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "error" => "Server error: " . $e->getMessage()]);
    error_log("PHP travelinfo Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
