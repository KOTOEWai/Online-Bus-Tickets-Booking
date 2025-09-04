<?php
include('./cors.php');
session_start();
include '../db/BusDb.php';

if (!isset($_SESSION['user_id'])) {
  echo json_encode(["error" => "Unauthorized"]);
  exit;
}

$user_id = $_SESSION['user_id'];

$sql = "
  SELECT 
    b.booking_id,
    b.schedule_id,
    b.booking_date,
    b.total_amount,
     b.payment_status,
    s.departure_time,
    s.arrival_time,
    r.start_location,
    r.end_location,
    bus.bus_number,
    bus.bus_type
  FROM bookings b
  JOIN schedules s ON b.schedule_id = s.schedule_id
  JOIN routes r ON s.route_id = r.route_id
  JOIN buses bus ON s.bus_id = bus.bus_id
  WHERE b.user_id = ?
  ORDER BY b.booking_date DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$tickets = [];
while ($row = $result->fetch_assoc()) {
  $tickets[] = $row;
}

echo json_encode($tickets);
