<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$data = json_decode(file_get_contents("php://input"));
$route_id = (int) $data->route_id;

$sql = "DELETE FROM routes WHERE route_id = $route_id";

if ($conn->query($sql)) {
    echo json_encode(['status' => 'success', 'message' => 'Route deleted']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>
