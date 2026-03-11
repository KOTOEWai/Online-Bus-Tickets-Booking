<?php
include('../../config/cors.php');

session_start();
include '../../config/db.php';


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

// Fetch price from schedule using prepared statement
$stmt = $conn->prepare("SELECT price FROM schedules WHERE schedule_id = ?");
$stmt->bind_param("i", $schedule_id);
$stmt->execute();
$schedule = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$schedule) {
    echo json_encode(['error' => 'Schedule not found']);
    exit();
}

$price = $schedule['price'];
$total = $price * count($selected_seats);

// Insert booking using prepared statement
$stmt = $conn->prepare("INSERT INTO bookings (user_id, schedule_id, total_amount, status) VALUES (?, ?, ?, 'pending')");
$stmt->bind_param("iid", $user_id, $schedule_id, $total);
$stmt->execute();
$booking_id = $conn->insert_id;
$stmt->close();

// Insert booking details and update seats using prepared statements
$stmtDetail = $conn->prepare("INSERT INTO bookingdetails (booking_id, seat_id) VALUES (?, ?)");
$stmtSeat = $conn->prepare("UPDATE seats SET is_booked = 1 WHERE seat_id = ?");

foreach ($selected_seats as $seat_id) {
    $stmtDetail->bind_param("ii", $booking_id, $seat_id);
    $stmtDetail->execute();

    $stmtSeat->bind_param("i", $seat_id);
    $stmtSeat->execute();
}
$stmtDetail->close();
$stmtSeat->close();

echo json_encode(['message' => 'Booking successful', 'booking_id' => $booking_id]);
?>