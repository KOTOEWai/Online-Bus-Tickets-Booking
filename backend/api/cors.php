<?php
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    // Fallback for requests without HTTP_ORIGIN (e.g., direct requests, some tools)
    header("Access-Control-Allow-Origin: *");
}

// Allow specific methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Allow specific headers
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Allow credentials (cookies, HTTP authentication) to be sent with the request
header("Access-Control-Allow-Credentials: true");


// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(); // IMPORTANT: Exit after sending preflight headers
}

// No other output should be here
?>
