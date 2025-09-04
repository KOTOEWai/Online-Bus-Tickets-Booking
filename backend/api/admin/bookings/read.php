<?php
// Include database connection and CORS headers
include('../../../db/BusDb.php');
include('../../../api/cors.php'); // Ensure this file correctly sets CORS headers

// Set content type to JSON
header("Content-Type: application/json; charset=UTF-8");

// SQL query to select booking details, including payment_status
$sql = "
    SELECT
        b.booking_id,
        b.booking_date,
        b.payment_status, -- Added payment_status here
        u.full_name,
        r.start_location,
        r.end_location,
        GROUP_CONCAT(s.seat_number ORDER BY s.seat_number SEPARATOR ', ') AS seats
    FROM
        bookings b
    JOIN
        users u ON b.user_id = u.user_id
    JOIN
        schedules sch ON b.schedule_id = sch.schedule_id
    JOIN
        routes r ON sch.route_id = r.route_id
    JOIN
        bookingdetails bd ON b.booking_id = bd.booking_id
    JOIN
        seats s ON bd.seat_id = s.seat_id
    GROUP BY
        b.booking_id, b.booking_date, b.payment_status, u.full_name, r.start_location, r.end_location -- Add payment_status to GROUP BY
    ORDER BY
        b.booking_date DESC
    LIMIT 10
";

$result = $conn->query($sql);

$bookings = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode($bookings);
} else {
    // Handle query error
    http_response_code(500);
    echo json_encode(["message" => "Error fetching bookings: " . $conn->error]);
}

$conn->close();
?>
