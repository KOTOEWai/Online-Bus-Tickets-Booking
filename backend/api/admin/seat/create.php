<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');
// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
// --- End Error Handling Configuration ---

try {
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    $data = json_decode(file_get_contents("php://input"));

    $schedule_id = (int)($data->schedule_id ?? 0); // Changed from bus_id to schedule_id
    $rows = (int)($data->num_rows ?? 0);
    $seats_per_row = (int)($data->seats_per_row ?? 0);

    if ($schedule_id === 0 || $rows === 0 || $seats_per_row === 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing or invalid input: schedule ID, rows, or seats per row.']);
        exit();
    }

    // Check if the schedule_id exists in the schedules table
    $check_schedule_sql = "SELECT schedule_id FROM schedules WHERE schedule_id = ?";
    $check_schedule_stmt = $conn->prepare($check_schedule_sql);
    if ($check_schedule_stmt === false) {
        throw new Exception("Failed to prepare schedule check statement: " . $conn->error);
    }
    $check_schedule_stmt->bind_param("i", $schedule_id);
    $check_schedule_stmt->execute();
    $check_schedule_result = $check_schedule_stmt->get_result();

    if ($check_schedule_result->num_rows === 0) {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "Schedule with provided ID does not exist."]);
        $check_schedule_stmt->close();
        $conn->close();
        exit();
    }
    $check_schedule_stmt->close();

    // Optional: Clear existing seats for this specific schedule
    // This is important to prevent duplicate seats if you regenerate for the same schedule.
    $delete_sql = "DELETE FROM seats WHERE schedule_id = ?";
    $delete_stmt = $conn->prepare($delete_sql);
    if ($delete_stmt === false) {
        throw new Exception("Failed to prepare delete statement: " . $conn->error);
    }
    $delete_stmt->bind_param("i", $schedule_id);
    $delete_stmt->execute();
    $delete_stmt->close();

    // Start a transaction for bulk insertion
    $conn->begin_transaction();
    $inserted_count = 0;

    $insert_sql = "INSERT INTO seats (schedule_id, seat_number, is_booked, created_at) VALUES (?, ?, FALSE, NOW())";
    $insert_stmt = $conn->prepare($insert_sql);
    if ($insert_stmt === false) {
        throw new Exception("Failed to prepare insert statement: " . $conn->error);
    }

    for ($r = 0; $r < $rows; $r++) {
        $row_letter = chr(65 + $r); // A, B, C...
        for ($s = 1; $s <= $seats_per_row; $s++) {
            $seat_number = $row_letter . $s;
            $insert_stmt->bind_param("is", $schedule_id, $seat_number);
            if ($insert_stmt->execute()) {
                $inserted_count++;
            } else {
                // Log individual seat insert failures if needed, but continue
                error_log("Failed to insert seat " . $seat_number . " for schedule " . $schedule_id . ": " . $insert_stmt->error);
            }
        }
    }

    $conn->commit(); // Commit the transaction

    $insert_stmt->close();
    $conn->close();

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Seats generated successfully for schedule ' . $schedule_id . '. Total: ' . $inserted_count . ' seats.']);

} catch (Exception $e) {
    if (isset($conn) && $conn->$in_transaction) {
        $conn->rollback();
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    error_log("PHP Seat Create Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
