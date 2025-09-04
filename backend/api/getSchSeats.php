<?php
include('./cors.php');
session_start();
include '../db/BusDb.php';

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
 

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get schedule_id from query parameters
    $schedule_id = filter_var($_GET['schedule_id'] ?? null, FILTER_VALIDATE_INT);

    if ($schedule_id === false || $schedule_id <= 0) {
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Invalid schedule ID provided."]);
        exit();
    }

    // Fetch schedule details
    $schedule_sql = "SELECT
                        s.schedule_id,
                        b.bus_number,
                        b.bus_type,
                        b.opertor_name, -- Corrected typo from 'opertor_name' to 'operator_name' in comment, but keeping original for now
                        b.total_seats,
                        r.start_location,
                        r.end_location,
                        s.departure_time,
                        s.arrival_time,
                        s.price
                    FROM
                        schedules s
                    JOIN
                        buses b ON s.bus_id = b.bus_id
                    JOIN
                        routes r ON s.route_id = r.route_id
                    WHERE
                        s.schedule_id = ?";
    $schedule_stmt = $conn->prepare($schedule_sql);
    if ($schedule_stmt === false) {
        throw new Exception("Failed to prepare schedule statement: " . $conn->error);
    }
    $schedule_stmt->bind_param("i", $schedule_id);
    $schedule_stmt->execute();
    $schedule_result = $schedule_stmt->get_result();
    $schedule_data = $schedule_result->fetch_assoc();
    $schedule_stmt->close();

    if (!$schedule_data) {
        http_response_code(404); // Not Found
        echo json_encode(["error" => "Schedule not found."]);
        exit();
    }

    // Fetch seats for this specific schedule_id
    $seats_sql = "SELECT
                    seat_id,
                    seat_number,
                    is_booked
                FROM
                    seats
                WHERE
                    schedule_id = ?
                ORDER BY
                    seat_number ASC"; // Order seats for consistent display
    $seats_stmt = $conn->prepare($seats_sql);
    if ($seats_stmt === false) {
        throw new Exception("Failed to prepare seats statement: " . $conn->error);
    }
    $seats_stmt->bind_param("i", $schedule_id);
    $seats_stmt->execute();
    $seats_result = $seats_stmt->get_result();

    $seats_data = [];
    if ($seats_result) {
        while ($row = $seats_result->fetch_assoc()) {
            // Ensure is_booked is treated as a boolean/number
            $row['is_booked'] = (int)$row['is_booked'];
            $seats_data[] = $row;
        }
    }
    $seats_stmt->close();
    $conn->close();

    http_response_code(200);
    echo json_encode([
        "schedule" => $schedule_data,
        "seats" => $seats_data
    ]);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
    error_log("PHP getSchSeats Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
