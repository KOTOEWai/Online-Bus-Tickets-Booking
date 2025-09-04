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
if ($id && $userId) {
  // 1. Approve manual_payments
  $stmt = $conn->prepare("UPDATE manual_payments SET status = 'approved' WHERE id = ?");
  $stmt->bind_param("i", $id);
  
  if ($stmt->execute()) {
    // 2. Get booking_id from manual_payments
    $getBooking = $conn->prepare("SELECT booking_id FROM manual_payments WHERE id = ?");
    $getBooking->bind_param("i", $id);
    $getBooking->execute();
    $result = $getBooking->get_result();
    
    if ($row = $result->fetch_assoc()) {
      $booking_id = $row['booking_id'];

      // 3. Update bookings table with payment_status
      $updateBooking = $conn->prepare("UPDATE bookings SET payment_status = 'approved' WHERE booking_id = ?");
      $updateBooking->bind_param("i", $booking_id);
      $updateBooking->execute();
    }
    if($userId>0){
      // 4. Insert notification
      $stmt = $conn->prepare("
        INSERT INTO user_notifications (user_id, type, title, message, is_read, created_at)
        VALUES (?, ?, ?, ?, 0, NOW())
    ");
      $stmt->bind_param("isss", $userId, $type, $title, $message);
      $stmt->execute();
    }
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["error" => "Failed to approve payment."]);
  }
} else {
  echo json_encode(["error" => "Invalid ID."]);
}
?>
