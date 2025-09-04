<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$data = json_decode(file_get_contents("php://input"));
$id = (int) $data->schedule_id;

$sql = "DELETE FROM schedules WHERE schedule_id = $id";

if ($conn->query($sql)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>
