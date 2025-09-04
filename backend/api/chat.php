<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0); // DO NOT display errors in the browser for production.
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
// --- End Error Handling Configuration ---

// --- Database Connection Configuration ---
$servername = "localhost"; // Or your database server name
$username = "root";        // Your database username
$password = "";            // Your database password
$dbname = "tickets";       // Your database name (from the SQL file)
// --- End Database Connection Configuration ---

// Get the raw POST data from the frontend
$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);
$user_message = (string)($data['message'] ?? '');

if (empty($user_message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "reply" => "No message provided."]);
    exit();
}

$ai_reply_content = '';

// Check if the user is asking for bus schedules using keywords
if (
    str_contains(strtolower($user_message), 'schedule') ||
    str_contains(strtolower($user_message), 'bus times') ||
    str_contains(strtolower($user_message), 'routes')
) {
    // User wants to see schedules, connect to the database
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        $ai_reply_content = "Sorry, I am unable to connect to the database to fetch schedules.";
        $response_data = ["success" => true, "reply" => $ai_reply_content];
    } else {
        // Construct the SQL query to get bus schedules and details for today's date and a departure time after the current time
        $sql = "
            SELECT
                r.start_location,
                r.end_location,
                b.bus_type,
                b.opertor_name,
                s.departure_time,
                s.arrival_time,
                s.price
           FROM schedules s
    JOIN routes r ON s.route_id = r.route_id
    JOIN buses b ON s.bus_id = b.bus_id
    WHERE s.departure_time > NOW()
    ORDER BY s.departure_time ASC;
        ";

        $result = $conn->query($sql);
        
        if ($result && $result->num_rows > 0) {
            $schedules = [];
            while ($row = $result->fetch_assoc()) {
                $schedules[] = [
                    "bus_type" => $row['bus_type'],
                    "operator_name" => $row['opertor_name'],
                    "start_location" => $row['start_location'],
                    "end_location" => $row['end_location'],
                    "departure_time" => $row['departure_time'],
                    "arrival_time" => $row['arrival_time'],
                    "price" => $row['price']
                ];
            }
            // Send the JSON array back to the frontend
            $response_data = ["success" => true, "schedules" => $schedules];
        } else {
            $ai_reply_content = "I couldn't find any upcoming bus schedules for today. Please check back later or try tomorrow.";
            $response_data = ["success" => true, "reply" => $ai_reply_content];
        }
    }
} else {
    // If the message is not about schedules, use the Gemini API as a fallback
    $apiKey = "AIzaSyCxiy_egwKwxc6x1SFCF2U_4PTLHfPoB30";
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

    $payload = [
        'contents' => [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $user_message]
                ]
            ]
        ]
    ];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        $error_msg = curl_error($ch);
        curl_close($ch);
        $ai_reply_content = "cURL Error: " . $error_msg;
    } else {
        curl_close($ch);
        $gemini_response = json_decode($response, true);
        if (isset($gemini_response['candidates'][0]['content']['parts'][0]['text'])) {
            $ai_reply_content = $gemini_response['candidates'][0]['content']['parts'][0]['text'];
        } else {
            error_log("Gemini API response structure unexpected: " . print_r($gemini_response, true));
            $ai_reply_content = 'Sorry, I could not get a response.';
        }
    }

    $response_data = ["success" => true, "reply" => $ai_reply_content];
}

// Send the AI's reply or schedules back to the frontend
http_response_code(200);
echo json_encode($response_data);

// Close the database connection if it was opened
if (isset($conn)) {
    $conn->close();
}

?>