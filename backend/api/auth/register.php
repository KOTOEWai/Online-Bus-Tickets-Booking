<?php
include('../../config/cors.php');

session_start();
include('../../config/db.php');

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data['name']);
$email = trim($data['email']);
$phone = trim($data['phone']);
$password = password_hash($data['password'], PASSWORD_DEFAULT);

$response = [];

$check = $conn->prepare("SELECT * FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
  $response['status'] = 'error';
  $response['message'] = '❌ Email already exists.';
} else {
  $sql = "INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("ssss", $name, $email, $password, $phone);

  if ($stmt->execute()) {
    $response['status'] = 'success';
    $response['message'] = '✅ Registration successful!';
  } else {
    $response['status'] = 'error';
    $response['message'] = 'Database error: ' . $stmt->error;
  }
}

echo json_encode($response);
?>