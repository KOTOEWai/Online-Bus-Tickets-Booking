<?php
include('./cors.php');


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0); // DO NOT display errors in the browser for production.
ini_set('log_errors', 1);    // Log errors to the PHP error log file.
ini_set('error_log', __DIR__ . '/php-error.log'); // Specify a log file path.
// --- End Error Handling Configuration ---

// Use a try-catch block to ensure a JSON response even on unexpected PHP errors
try {
    // Include your database connection file
    // Assuming BusDb.php defines $conn
    include('../db/BusDb.php'); 
   

    // Check if the database connection was successful
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Decode the JSON data sent from the frontend (React)
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract search parameters
    $from = $data['from'] ?? null;
    $to = $data['to'] ?? null;
    $date = $data['date'] ?? null;
    $travellerType = $data['travellerType'] ?? 'local'; // Default to 'local'
    $passengerCount = $data['passengerCount'] ?? 1;     // Default to 1

    // Extract filter and sort parameters
    $busTypeFilter = $data['busTypeFilter'] ?? null;
    $priceRangeFilter = $data['priceRangeFilter'] ?? null;
    $sortBy = $data['sortBy'] ?? null;
    $sortOrder = $data['sortOrder'] ?? 'ASC'; // Default sort order

    // Basic validation for required parameters
    if (empty($from) || empty($to) || empty($date)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required search criteria (From, To, Date)."]);
        exit();
    }

    // Base SQL query
    $sql = "SELECT
                s.schedule_id,
                b.bus_number,
                b.bus_type,
                b.total_seats,
                b.image,
                b.description,
                r.start_location,
                r.end_location,
                s.departure_time,
                s.arrival_time,
                s.price,
                TIMESTAMPDIFF(MINUTE, s.departure_time, s.arrival_time) AS duration_minutes
            FROM
                schedules s
            JOIN
                buses b ON s.bus_id = b.bus_id
            JOIN
                routes r ON s.route_id = r.route_id
            WHERE
                r.start_location = ? AND r.end_location = ? AND DATE(s.departure_time) = ?";

    $params = [$from, $to, $date];
    $types = "sss"; // String types for from, to, date

    // Apply Bus Type Filter
    if (!empty($busTypeFilter)) {
        $sql .= " AND b.bus_type = ?";
        $params[] = $busTypeFilter;
        $types .= "s";
    }

    // Apply Price Range Filter
    if (!empty($priceRangeFilter)) {
        if ($priceRangeFilter === '100001+') {
            $sql .= " AND s.price >= 100001";
        } else {
            // Split the range (e.g., "35000-50000")
            list($minPrice, $maxPrice) = explode('-', $priceRangeFilter);
            $sql .= " AND s.price BETWEEN ? AND ?";
            $params[] = (int)$minPrice;
            $params[] = (int)$maxPrice;
            $types .= "ii"; // Integer types for min/max price
        }
    }

    // Apply Sorting
    if (!empty($sortBy)) {
        $sortColumn = '';
        // Validate sortBy to prevent SQL injection
        if ($sortBy === 'departure_time') {
            $sortColumn = 's.departure_time';
        } elseif ($sortBy === 'price') {
            $sortColumn = 's.price';
        }

        if (!empty($sortColumn)) {
            // Validate sortOrder to prevent SQL injection
            $safeSortOrder = (strtoupper($sortOrder) === 'DESC') ? 'DESC' : 'ASC';
            $sql .= " ORDER BY " . $sortColumn . " " . $safeSortOrder;
        }
    } else {
        // Default sorting if no specific sort is applied
        $sql .= " ORDER BY s.departure_time ASC";
    }

    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Dynamically bind parameters using call_user_func_array
    // The first argument to bind_param is the type string, followed by parameters
    // array_merge will combine the type string and the actual parameters
    call_user_func_array([$stmt, 'bind_param'], array_merge([$types], $params));

    // Execute the prepared statement
    $stmt->execute();

    // Get the result set
    $result = $stmt->get_result();

    $response = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $response[] = $row;
        }
        echo json_encode($response);
    } else {
        throw new Exception("Database query failed: " . $conn->error);
    }

    // Close the prepared statement and database connection
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    // Log the error for debugging purposes (check your php-error.log file)
    error_log("PHP searchBus Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
