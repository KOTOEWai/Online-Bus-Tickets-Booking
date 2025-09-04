<?php
include('./cors.php');


include('../db/BusDb.php');
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

    // SQL query to fetch schedules with bus and route details
    $sql = "SELECT
                s.schedule_id,
                b.bus_number,
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
            ORDER BY
                s.departure_time DESC"; // Order by most recent schedules first

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    $schedules = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $schedules[] = $row;
        }
        http_response_code(200);
        echo json_encode($schedules);
    } else {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP readSchedules Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
