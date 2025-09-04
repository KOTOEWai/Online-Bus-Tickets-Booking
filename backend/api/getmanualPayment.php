<?php
include('./cors.php');
include '../db/BusDb.php';

$sql = "SELECT * FROM manual_payments ORDER BY submitted_at DESC";
$result = $conn->query($sql);

$payments = [];
while ($row = $result->fetch_assoc()) {
  $payments[] = $row;
}

echo json_encode($payments);
