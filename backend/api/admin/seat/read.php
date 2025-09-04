<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

// --- PHP Error Handling ---
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
// ---------------------------

try {
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get schedule_id from GET or POST (GET recommended for read)
    $schedule_id = isset($_GET['schedule_id']) ? (int)$_GET['schedule_id'] : 0;

    if ($schedule_id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing or invalid schedule_id']);
        exit();
    }

    // Check if schedule exists
    $check_stmt = $conn->prepare("SELECT schedule_id FROM schedules WHERE schedule_id = ?");
    if ($check_stmt === false) {
        throw new Exception("Failed to prepare schedule check statement: " . $conn->error);
    }
    $check_stmt->bind_param("i", $schedule_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    if ($check_result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Schedule not found']);
        $check_stmt->close();
        $conn->close();
        exit();
    }
    $check_stmt->close();

    // Fetch seats for the schedule
    $stmt = $conn->prepare("SELECT seat_id, seat_number, is_booked, created_at FROM seats WHERE schedule_id = ? ORDER BY seat_number ASC");
    if ($stmt === false) {
        throw new Exception("Failed to prepare seat select statement: " . $conn->error);
    }
    $stmt->bind_param("i", $schedule_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $seats = [];
    while ($row = $result->fetch_assoc()) {
        $seats[] = [
            'seat_id' => (int)$row['seat_id'],
            'seat_number' => $row['seat_number'],
            'is_booked' => (bool)$row['is_booked'],
            'created_at' => $row['created_at']
        ];
    }

    $stmt->close();
    $conn->close();

    http_response_code(200);
    echo json_encode(['success' => true, 'schedule_id' => $schedule_id, 'total_seats' => count($seats), 'data' => $seats]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    error_log("PHP Seat Read Error: " . $e->getMessage() . " on line " . $e->getLine());
}
?>
