<?php
include('./cors.php');

session_start();
include '../db/BusDb.php';

if (!isset($_SESSION['user_id'])) {
  echo json_encode(['error' => 'Not authenticated']);
  exit;
}

$booking_id = $_POST['booking_id'] ?? null;
$transaction_id = $_POST['transaction_id'] ?? null;
$user_id = $_SESSION['user_id'];

if (!$booking_id || !$transaction_id) {
  echo json_encode(['error' => 'Missing fields']);
  exit;
}

$screenshotPath = null;

if (isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] === 0) {
  $targetDir = "../uploads/";
  if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
  }

  $fileName = time() . '_' . basename($_FILES['screenshot']['name']);
  $targetFile = $targetDir . $fileName;
  if (move_uploaded_file($_FILES['screenshot']['tmp_name'], $targetFile)) {
    $screenshotPath = 'uploads/' . $fileName;
  }
}
$conn->query("UPDATE bookings SET status = 'approved' WHERE booking_id = $booking_id");
$stmt = $conn->prepare("INSERT INTO manual_payments (booking_id, user_id, transaction_id, screenshot_path) VALUES (?, ?, ?, ?)");
$stmt->bind_param("iiss", $booking_id, $user_id, $transaction_id, $screenshotPath);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['error' => 'Failed to submit payment']);
}
