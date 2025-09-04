<?php
include('./cors.php');

session_start();
include '../db/BusDb.php';

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['error' => 'Unauthorized']);
  http_response_code(401);
  exit();
}

$booking_id = $_GET['booking_id'] ?? null;
$user_id = $_SESSION['user_id'];

if (!$booking_id) {
  echo json_encode(['error' => 'Booking ID required']);
  http_response_code(400);
  exit();
}

$stmt = $conn->prepare("
  SELECT b.booking_id, b.total_amount, s.price, b.booking_date,
         s.departure_time, s.arrival_time,
         r.start_location, r.end_location,
         bus.bus_type, bus.opertor_name
  FROM bookings b
  JOIN schedules s ON b.schedule_id = s.schedule_id
  JOIN routes r ON s.route_id = r.route_id
  JOIN buses bus ON s.bus_id = bus.bus_id
  WHERE b.booking_id = ? AND b.user_id = ?
");
$stmt->bind_param("ii", $booking_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$info = $result->fetch_assoc();

if (!$info) {
  echo json_encode(['error' => 'Booking not found']);
  http_response_code(404);
  exit();
}

// Get seats
$seatStmt = $conn->prepare("SELECT s.seat_number FROM bookingdetails bd JOIN seats s ON bd.seat_id = s.seat_id WHERE bd.booking_id = ?");
$seatStmt->bind_param("i", $booking_id);
$seatStmt->execute();
$seatResult = $seatStmt->get_result();

$seats = [];
while ($row = $seatResult->fetch_assoc()) {
  $seats[] = $row['seat_number'];
}
$info['seats'] = $seats;

echo json_encode($info);
?>
