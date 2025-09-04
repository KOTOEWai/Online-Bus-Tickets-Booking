<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

header('Content-Type: application/json');

$sql = "
    SELECT 
        s.schedule_id,
        b.bus_number,
        b.total_seats,
        b.bus_type,
        r.start_location,
        r.end_location,
        COUNT(se.seat_id) AS generated_seats
    FROM schedules s
    JOIN buses b ON s.bus_id = b.bus_id
    JOIN routes r ON s.route_id = r.route_id
    LEFT JOIN seats se ON s.schedule_id = se.schedule_id
    GROUP BY s.schedule_id, b.bus_number, r.start_location, r.end_location
    ORDER BY s.schedule_id ASC
";

$result = $conn->query($sql);
$schedules = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $schedules[] = [
            'schedule_id'    => (int)$row['schedule_id'],
            'bus_number'     => $row['bus_number'],
            'start_location' => $row['start_location'],
            'end_location'   => $row['end_location'],
            'total_seats'    => (int)$row['total_seats'],
            'bus_type'       => $row['bus_type'],
            'generated_seats'=> (int)$row['generated_seats']
        ];
    }
}

echo json_encode($schedules);
$conn->close();
