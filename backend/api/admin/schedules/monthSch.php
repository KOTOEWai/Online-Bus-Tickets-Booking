<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

header('Content-Type: application/json');

$sql = "
    SELECT 
        s.schedule_id,
        b.bus_number,
        r.start_location,
        r.end_location,
        s.departure_time,
        s.total_seats,
        COUNT(se.seat_id) AS generated_seats
    FROM schedules s
    JOIN buses b ON s.bus_id = b.bus_id
    JOIN routes r ON s.route_id = r.route_id
    LEFT JOIN seats se ON s.schedule_id = se.schedule_id
    WHERE s.departure_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 1 MONTH)
    GROUP BY s.schedule_id, b.bus_number, r.start_location, r.end_location, s.departure_time, s.total_seats
    ORDER BY s.departure_time ASC
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
            'departure_time' => $row['departure_time'],
            'total_seats'    => (int)$row['total_seats'],
            'generated_seats'=> (int)$row['generated_seats']
        ];
    }
}

echo json_encode($schedules);
$conn->close();
