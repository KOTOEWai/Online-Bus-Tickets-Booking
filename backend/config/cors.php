<?php
// Restrict origin to specific frontend URL
$allowed_origin = getenv('FRONTEND_URL') ?: "http://localhost:3000";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowed_origin) {
    header("Access-Control-Allow-Origin: $allowed_origin");
} else {
    // In production, you might want to return 403 for unauthorized origins
    // For now, we allow the fallback for development ease but recommend restriction
    header("Access-Control-Allow-Origin: $allowed_origin");
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