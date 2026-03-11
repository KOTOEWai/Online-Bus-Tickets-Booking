<?php
include('../../config/cors.php');
session_start();
include('../../config/db.php');

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data['email']);
$password = $data['password'];
$response = [];

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
  $user = $result->fetch_assoc();
  if (password_verify($password, $user['password']) || md5($password) === $user['password']) {
    // If it was an old MD5 password, re-hash it to the new secure format
    if (md5($password) === $user['password']) {
      $newHash = password_hash($password, PASSWORD_DEFAULT);
      $updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
      $updateStmt->bind_param("si", $newHash, $user['user_id']);
      $updateStmt->execute();
    }

    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['role'] = $user['role'];
    $response['status'] = 'success';
    $response['role'] = $user['role'];
    $response['message'] = '✅ Login successful!';
    $response['user_id'] = $user['user_id'];
    $response['full_name'] = $user['full_name'];
    $response['email'] = $user['email'];
  } else {
    $response['status'] = 'error';
    $response['message'] = '❌ Incorrect password!';
  }
} else {
  $response['status'] = 'error';
  $response['message'] = '❌ User not found!';

}
echo json_encode($response);
?>