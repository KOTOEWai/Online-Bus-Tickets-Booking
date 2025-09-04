<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');


$result = $conn->query("SELECT * FROM buses");
$buses = [];

while ($row = $result->fetch_assoc()) {
    $buses[] = $row;
}

echo json_encode($buses);
?>
