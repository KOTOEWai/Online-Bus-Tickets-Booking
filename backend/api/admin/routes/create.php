<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$data = json_decode(file_get_contents("php://input"));

$start = $conn->real_escape_string($data->start_location);
$end = $conn->real_escape_string($data->end_location);
$distance = (int) $data->distance_km;

$sql = "INSERT INTO routes (start_location, end_location, distance_km) 
        VALUES ('$start', '$end', $distance)";

if ($conn->query($sql)) {
    echo json_encode(['status' => 'success', 'message' => 'Route added successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>
