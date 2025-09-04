<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;
$title = trim((string)($data['title'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$userId = $data['userId'] ?? null;
$adminId =(int)( $data['admin_user_id'] ?? null);
$type = trim((string)($data['type'] ?? 'Alert')); // e.g., promotion | booking | reminder
if ($id) {
  // 1. Update manual_payments table
  $stmt = $conn->prepare("UPDATE manual_payments SET status = 'rejected' WHERE id = ?");
  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    // 2. Get booking_id from manual_payments
    $getBooking = $conn->prepare("SELECT booking_id FROM manual_payments WHERE id = ?");
    $getBooking->bind_param("i", $id);
    $getBooking->execute();
    $result = $getBooking->get_result();

    if ($row = $result->fetch_assoc()) {
      $booking_id = $row['booking_id'];

       $seatQuery = $conn->prepare("
      SELECT seat_id FROM bookingdetails WHERE booking_id = ?
    ");
    $seatQuery->bind_param("i", $booking_id);
    $seatQuery->execute();
    $seatResult = $seatQuery->get_result();

    while ($seat = $seatResult->fetch_assoc()) {
      $conn->query("UPDATE seats SET is_booked = 0 WHERE seat_id = " . $seat['seat_id']);
    }

    $conn->query("DELETE FROM travellerInfo WHERE booking_id = $booking_id");
    $conn->query("DELETE FROM bookingdetails WHERE booking_id = $booking_id");
     
     
    $deleteBooking = $conn->prepare("DELETE FROM bookings WHERE booking_id = ?");
    $deleteBooking->bind_param("i", $booking_id);
    $deleteBooking->execute();
    
   $deletePayment = $conn->prepare("DELETE FROM manual_payments WHERE id = ?");
  $deletePayment->bind_param("i", $id);
   $deletePayment->execute();
      $updateBookingComfirm = $conn->prepare("UPDATE bookings SET status = 'rejected' WHERE booking_id = ?");
      $updateBookingComfirm->bind_param("i", $booking_id);
      $updateBookingComfirm->execute();
      // 3. Update payment_status in bookings to 'rejected'
      $updateBooking = $conn->prepare("UPDATE bookings SET payment_status = 'rejected' WHERE booking_id = ?");
      $updateBooking->bind_param("i", $booking_id);
      $updateBooking->execute();
    }
    if($userId>0){
      // 4. Insert notification
      $stmt = $conn->prepare("
        INSERT INTO user_notifications (user_id, type, title, message, is_read, created_at)
        VALUES (?, ?, ?, ?, 0, NOW()
        ");
      $stmt->bind_param("isss", $userId, $type, $title, $message);
      $stmt->execute();
    }
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["error" => "Failed to reject payment."]);
  }
} else {
  echo json_encode(["error" => "Invalid ID."]);
}
?>
