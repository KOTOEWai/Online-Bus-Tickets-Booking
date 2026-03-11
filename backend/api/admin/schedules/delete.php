<?php
include('../../../config/db.php');
include('../../../config/cors.php');

$data = json_decode(file_get_contents("php://input"));
$id = (int) $data->schedule_id;

$stmt = $conn->prepare("DELETE FROM schedules WHERE schedule_id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
$stmt->close();
$conn->close();
?>
