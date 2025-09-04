<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$sql = "SELECT * FROM routes ORDER BY route_id DESC";
$result = $conn->query($sql);

$routes = [];
while ($row = $result->fetch_assoc()) {
    $routes[] = $row;
}

echo json_encode($routes);
?>
