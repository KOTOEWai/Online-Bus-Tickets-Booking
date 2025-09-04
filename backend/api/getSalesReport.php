<?php
include('./cors.php');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- PHP Error Handling Configuration ---
// It's crucial to prevent PHP errors/warnings from being outputted as HTML,
// as this corrupts the JSON response for the frontend.
error_reporting(E_ALL); // Report all PHP errors
ini_set('display_errors', 0); // DO NOT display errors in the browser for production.
                             // Errors will be logged instead.
ini_set('log_errors', 1);    // Log errors to the PHP error log file.
ini_set('error_log', __DIR__ . '/php-error.log'); // Specify a log file path. Ensure this directory is writable.
// --- End Error Handling Configuration ---

// Use a try-catch block to ensure a JSON response even on unexpected PHP errors
try {
    // Include your database connection file
    // Ensure the path is correct relative to this script.
    include('../db/BusDb.php'); // Assumed to define $conn

    // Check if the database connection was successful
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }
    // Decode the JSON data sent from the frontend (React)
    $data = json_decode(file_get_contents("php://input"), true);
    // Extract startDate and endDate from the decoded data
    $startDate = $data['startDate'] ?? null;
    $endDate = $data['endDate'] ?? null;
    $response = []; // Initialize an empty array to hold the sales records
    // Basic validation for date format (YYYY-MM-DD)
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $startDate) || !preg_match("/^\d{4}-\d{2}-\d{2}$/", $endDate)) {
        http_response_code(400); // Bad Request status code
        echo json_encode(["success" => false, "message" => "Invalid date format. Dates must be YYYY-MM-DD."]);
        exit();
    }

    // SQL query to fetch sales data within the specified date range.
    // MODIFIED: Changed 'b.status' to 'b.payment_status' for booking_status.
    $sql = "SELECT
                b.booking_id,
                bus.bus_number,
                bus.bus_type,
                r.start_location,
                r.end_location,
                s.departure_time,
                b.total_amount,
                COUNT(bd.seat_id) AS num_seats,
                b.payment_status AS booking_status, -- Changed from b.status
                b.booking_date
            FROM
                bookings b
            JOIN
                schedules s ON b.schedule_id = s.schedule_id
            JOIN
                buses bus ON s.bus_id = bus.bus_id
            JOIN
                routes r ON s.route_id = r.route_id
            LEFT JOIN
                bookingdetails bd ON b.booking_id = bd.booking_id
            WHERE
                DATE(b.booking_date) BETWEEN ? AND ?
            GROUP BY
                b.booking_id, bus.bus_number, bus.bus_type, r.start_location, r.end_location, s.departure_time, b.total_amount, b.payment_status, b.booking_date -- Changed b.status to b.payment_status
            ORDER BY
                b.booking_date DESC";

    // Prepare the SQL statement to prevent SQL injection
    $stmt = $conn->prepare($sql);

    // Check if the statement preparation was successful
    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters to the prepared statement
    $stmt->bind_param("ss", $startDate, $endDate);

    // Execute the prepared statement
    $stmt->execute();

    // Get the result set from the executed statement
    $result = $stmt->get_result();

    // Check if the query execution was successful and results were returned
    if ($result) {
        // Fetch each row as an associative array and add it to the $response array
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
        // Encode the PHP array into a JSON string and echo it as the response
        echo json_encode($response);
    } else {
        throw new Exception("Database query failed: " . $conn->error);
    }

    // Close the prepared statement and database connection
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Catch any exceptions and return a JSON error response
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    // It's good practice to log the full error details on the server side,
    // but only send a generic message to the client for security.
    error_log("PHP Sales Report Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
