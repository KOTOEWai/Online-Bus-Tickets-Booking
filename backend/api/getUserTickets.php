<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

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
    // Adjust the path if your BusDb.php is located elsewhere relative to this file
    include '../db/BusDb.php';

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get user_id from GET parameters
    $user_id = filter_var($_GET['user_id'] ?? null, FILTER_SANITIZE_STRING);

    if (empty($user_id)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "User ID is required."]);
        exit();
    }

    // SQL query to fetch all relevant booking and traveller information for a user
    // This query joins multiple tables to get a comprehensive view of each ticket.
    $sql = "SELECT
                b.booking_id,
                bu.bus_number,
                bu.bus_type,
                r.start_location,
                r.end_location,
                s.departure_time,
                s.arrival_time,
                s.price,
                b.total_amount,
                GROUP_CONCAT(se.seat_number ORDER BY se.seat_number ASC) AS seats_booked,
                ti.name AS traveller_name,
                ti.gender AS traveller_gender,
                ti.phone AS traveller_phone,
                ti.email AS traveller_email,
                ti.special_request AS traveller_special_request,
                bu.opertor_name
            FROM
                bookings b
            JOIN
                schedules s ON b.schedule_id = s.schedule_id
            JOIN
                buses bu ON s.bus_id = bu.bus_id
            JOIN
                routes r ON s.route_id = r.route_id
            LEFT JOIN
                bookingdetails bd ON b.booking_id = bd.booking_id
            LEFT JOIN
                seats se ON bd.seat_id = se.seat_id
            LEFT JOIN
                travellerinfo ti ON b.booking_id = ti.booking_id
            WHERE
                b.user_id = ?
            GROUP BY
                b.booking_id, bu.bus_number, bu.bus_type, r.start_location, r.end_location,
                s.departure_time, s.arrival_time, s.price, b.total_amount, bu.opertor_name,
                ti.name, ti.gender, ti.phone, ti.email, ti.special_request
            ORDER BY
                s.departure_time DESC";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    $stmt->bind_param("s", $user_id); // 's' for string, assuming user_id is a string/varchar

    $stmt->execute();
    $result = $stmt->get_result();

    $tickets = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $tickets[] = $row;
        }
        echo json_encode($tickets);
    } else {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP getUserTickets Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
