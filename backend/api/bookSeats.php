<?php
include('./cors.php');

session_start();
include '../db/BusDb.php';


$data = json_decode(file_get_contents("php://input"), true);
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['error' => 'Not authenticated']);
    exit();
}

$schedule_id = $data['id'];
$selected_seats = $data['selected_seats'];

if (!$schedule_id || !is_array($selected_seats) || count($selected_seats) === 0) {
    echo json_encode(['error' => 'Missing data']);
    exit();
}

// Fetch price from schedule
$schedule = $conn->query("SELECT * FROM schedules WHERE schedule_id = $schedule_id")->fetch_assoc();
$price = $schedule['price'];
$total = $price * count($selected_seats);

// Insert booking
$conn->query("INSERT INTO bookings (user_id, schedule_id, total_amount, status) VALUES ($user_id, $schedule_id, $total, 'pending')");
$booking_id = $conn->insert_id;

// Insert booking details and update seats
foreach ($selected_seats as $seat_id) {
    $conn->query("INSERT INTO bookingdetails (booking_id, seat_id) VALUES ($booking_id, $seat_id)");
    $conn->query("UPDATE seats SET is_booked = 1 WHERE seat_id = $seat_id");
}

echo json_encode(['message' => 'Booking successful', 'booking_id' => $booking_id]);
?>
