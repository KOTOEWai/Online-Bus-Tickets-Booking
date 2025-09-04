<?php
include('./cors.php');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- PHP Error Handling Configuration ---
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php-error.log');
// --- End Error Handling Configuration ---

try {
    // Include your database connection file
     include ('../db/BusDb.php');

    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Unknown error"));
    }

    // Get the raw POST data
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    // Validate and sanitize input
    $user_id = (int)($data['user_id'] ?? 0);
    $rating = filter_var($data['rating'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);
    $comment = (string)($data['comment'] ?? '');

    // Basic validation for required fields
    if ($user_id === 0 || $rating === false || empty($comment)) {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "Required fields (user ID, rating, comment) are missing or invalid."]);
        exit();
    }

    // Check if the user exists in the 'users' table
    $user_check_sql = "SELECT user_id FROM users WHERE user_id = ?";
    $user_check_stmt = $conn->prepare($user_check_sql);
    if ($user_check_stmt === false) {
        throw new Exception("Failed to prepare user check statement: " . $conn->error);
    }
    $user_check_stmt->bind_param("i", $user_id);
    $user_check_stmt->execute();
    $user_check_result = $user_check_stmt->get_result();

    if ($user_check_result->num_rows === 0) {
        http_response_code(404); // Not Found
        echo json_encode(["success" => false, "message" => "User with provided ID does not exist."]);
        $user_check_stmt->close();
        $conn->close();
        exit();
    }
    $user_check_stmt->close();

    // Check if the user has already submitted a review (optional, but good practice)
    $check_sql = "SELECT review_id FROM reviews WHERE user_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("i", $user_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["success" => false, "message" => "You have already submitted a review."]);
        $check_stmt->close();
        $conn->close();
        exit();
    }
    $check_stmt->close();

    // --- Perform Sentiment Analysis using Gemini API ---
    $apiKey = "AIzaSyCxiy_egwKwxc6x1SFCF2U_4PTLHfPoB30"; // Canvas will automatically provide this at runtime. DO NOT put your actual key here.
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . $apiKey;

    // Craft a clear prompt for sentiment analysis
    $sentiment_prompt = "Analyze the sentiment of the following review text. Respond with only one word: 'Positive', 'Negative', or 'Neutral'.\n\nReview: \"" . $comment . "\"";

    $gemini_payload = [
        'contents' => [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $sentiment_prompt]
                ]
            ]
        ]
    ];

    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($gemini_payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $gemini_response_raw = curl_exec($ch);
    if (curl_errno($ch)) {
        error_log("Gemini cURL Error for sentiment: " . curl_error($ch));
        $sentiment = "Neutral"; // Default to neutral on API error
    } else {
        $gemini_response = json_decode($gemini_response_raw, true);
        $sentiment = "Neutral"; // Default sentiment

        if (isset($gemini_response['candidates'][0]['content']['parts'][0]['text'])) {
            $ai_sentiment_text = trim($gemini_response['candidates'][0]['content']['parts'][0]['text']);
            // Standardize the sentiment word
            if (in_array($ai_sentiment_text, ['Positive', 'Negative', 'Neutral'])) {
                $sentiment = $ai_sentiment_text;
            } else {
                error_log("Unexpected sentiment response from Gemini: " . $ai_sentiment_text);
            }
        } else {
            error_log("Gemini sentiment response structure unexpected: " . print_r($gemini_response, true));
        }
    }
    curl_close($ch);
    // --- End Sentiment Analysis ---

    // Prepare SQL statement to insert data into the 'reviews' table, including sentiment
    $sql = "INSERT INTO reviews (user_id, rating, comment, sentiment, created_at) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("Failed to prepare SQL statement: " . $conn->error);
    }

    // Bind parameters: "siss" -> s for string (user_id), i for integer (rating), s for string (comment), s for string (sentiment)
    $stmt->bind_param("iiss", $user_id, $rating, $comment, $sentiment); // Changed bind_param type to iiss

    // Execute the statement
    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(["success" => true, "message" => "Review submitted successfully.", "review_id" => $conn->insert_id, "sentiment" => $sentiment]);
    } else {
        throw new Exception("Failed to insert review: " . $stmt->error);
    }

    // Close statement and connection
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
    error_log("PHP submitReview Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>