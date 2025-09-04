<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"));
$booking_id = intval($data->booking_id ?? 0);

if (!$booking_id) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid booking ID']);
    exit;
}

$conn->begin_transaction();

try {
    // Step 1: Unbook seats
    $seat_stmt = $conn->prepare("SELECT seat_id FROM bookingdetails WHERE booking_id = ?");
    $seat_stmt->bind_param("i", $booking_id);
    $seat_stmt->execute();
    $seat_result = $seat_stmt->get_result();

    while ($seat = $seat_result->fetch_assoc()) {
        $seat_id = $seat['seat_id'];
        $update_seat = $conn->prepare("UPDATE seats SET is_booked = 0 WHERE seat_id = ?");
        $update_seat->bind_param("i", $seat_id);
        $update_seat->execute();
    }

    // Step 2: Delete from bookingdetails
    $stmt1 = $conn->prepare("DELETE FROM bookingdetails WHERE booking_id = ?");
    $stmt1->bind_param("i", $booking_id);
    $stmt1->execute();

    // Step 3: Delete from travellerinfo
    $stmt2 = $conn->prepare("DELETE FROM travellerinfo WHERE booking_id = ?");
    $stmt2->bind_param("i", $booking_id);
    $stmt2->execute();

    // Step 4: Delete from payments
    $stmt3 = $conn->prepare("DELETE FROM manual_payments WHERE booking_id = ?");
    $stmt3->bind_param("i", $booking_id);
    $stmt3->execute();

    // Step 5: Delete from bookings
    $stmt4 = $conn->prepare("DELETE FROM bookings WHERE booking_id = ?");
    $stmt4->bind_param("i", $booking_id);
    $stmt4->execute();

    $conn->commit();
    echo json_encode(['status' => 'success', 'message' => '✅ Booking and related data deleted successfully.']);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['status' => 'error', 'message' => '❌ Failed to delete booking: ' . $e->getMessage()]);
}
?>
