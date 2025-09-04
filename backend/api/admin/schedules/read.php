<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$sql = "SELECT s.*, b.bus_number, r.start_location, r.end_location 
        FROM schedules s
        JOIN buses b ON s.bus_id = b.bus_id
        JOIN routes r ON s.route_id = r.route_id";

$result = $conn->query($sql);

$schedules = [];

while ($row = $result->fetch_assoc()) {
    $schedules[] = $row;
}

echo json_encode($schedules);
?>
