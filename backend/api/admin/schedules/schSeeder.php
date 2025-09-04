<?php
include('../../../db/BusDb.php');
date_default_timezone_set('Asia/Yangon');

$startDate = new DateTime();
$endDate = new DateTime('2025-08-28');

$buses = [
    ['bus_id' => 24, 'route_id' => 29, 'time' => '08:00:00', 'total_seats' => 32, 'duration' => '4 hours'],
    ['bus_id' => 25, 'route_id' => 28, 'time' => '09:00:00', 'total_seats' => 32, 'duration' => '5 hours'],
    ['bus_id' => 26, 'route_id' => 24, 'time' => '10:00:00', 'total_seats' => 32, 'duration' => '7 hours'],
    ['bus_id' => 29, 'route_id' => 31, 'time' => '11:00:00', 'total_seats' => 32, 'duration' => '3 hours'],
    ['bus_id' => 16, 'route_id' => 25, 'time' => '12:00:00', 'total_seats' => 28, 'duration' => '4 hours'],
    ['bus_id' => 27, 'route_id' => 32, 'time' => '13:00:00', 'total_seats' => 20, 'duration' => '1 hours'],
    ['bus_id' => 30, 'route_id' => 26,  'time' => '14:00:00', 'total_seats' => 20, 'duration' => '2 hours']
];

try {
    $conn->begin_transaction();

    $insertSQL = "INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($insertSQL);

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $currentDate = clone $startDate;

    while ($currentDate <= $endDate) {
        foreach ($buses as $bus) {
            $departureDateTime = new DateTime($currentDate->format('Y-m-d') . ' ' . $bus['time']);
            $arrivalDateTime = clone $departureDateTime;
            $arrivalDateTime->modify('+' . $bus['duration']);

            $departureFormatted = $departureDateTime->format('Y-m-d H:i:s');
            $arrivalFormatted = $arrivalDateTime->format('Y-m-d H:i:s');

            $stmt->bind_param(
                "iiss",
                $bus['bus_id'],
                $bus['route_id'],
                $departureFormatted,
                $arrivalFormatted,
               
            );
            $stmt->execute();
        }
        $currentDate->modify('+1 day');
    }

    $conn->commit();
    echo json_encode([
        "success" => true,
        "message" => "Schedules inserted from {$startDate->format('Y-m-d')} to {$endDate->format('Y-m-d')}"
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
