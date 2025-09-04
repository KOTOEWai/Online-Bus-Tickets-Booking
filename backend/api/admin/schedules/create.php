<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

$data = json_decode(file_get_contents("php://input"));

$bus_id = trim($data->bus_id ?? '');
$route_id = trim($data->route_id ?? '');
$departure = trim($data->departure_time ?? '');
$arrival = trim($data->arrival_time ?? '');
$price = trim($data->price ?? '');

$response = ['status' => 'error'];

// 1. Check for empty fields
if (empty($bus_id) || empty($route_id) || empty($departure) || empty($arrival) || empty($price)) {
    $response['message'] = "❌ All fields are required.";
    echo json_encode($response);
    exit;
}

// 2. Validate date format (optional but useful)
if (!strtotime($departure) || !strtotime($arrival)) {
    $response['message'] = "❌ Invalid date format.";
    echo json_encode($response);
    exit;
}

// 3. Validate that departure is today or in future
$currentDateTime = new DateTime();
$departureDateTime = new DateTime($departure);
if ($departureDateTime < $currentDateTime) {
    $response['message'] = "🚫 Departure must be today or a future time.";
    echo json_encode($response);
    exit;
}

// 4. Validate arrival is after departure
if (strtotime($arrival) <= strtotime($departure)) {
    $response['message'] = "⛔ Arrival time must be after departure time.";
    echo json_encode($response);
    exit;
}

// 5. Validate price is a positive number and convert to integer
if (!is_numeric($price) || $price <= 0) {
    $response['message'] = "💰 Price must be a positive number.";
    echo json_encode($response);
    exit;
}

// Cast the price to an integer. This will remove any decimal part.
$price_int = intval($price);

// 6. Use prepared statement for safety
// Assuming bus_id, route_id, and price_int are integers.
$stmt = $conn->prepare("INSERT INTO schedules (bus_id, route_id, departure_time, arrival_time, price) VALUES (?, ?, ?, ?, ?)");
// The bind_param type 'iissi' is used for int, int, string, string, int
$stmt->bind_param("iissi", $bus_id, $route_id, $departure, $arrival, $price_int);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => '✅ Schedule added successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => '❌ Failed to insert schedule. ' . $conn->error]);
}

$stmt->close();
$conn->close();
?>
