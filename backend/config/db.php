<?php

// In a real production environment, you should use a library like phpdotenv
// or set environment variables in your web server configuration (Apache/Nginx).
// For now, we will use default values but move them to a more manageable structure.

$host = getenv('DB_HOST') ?: "localhost";
$username = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASS') ?: "";
$database = getenv('DB_NAME') ?: "tickets";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    // In production, do not reveal connection details to the user
    error_log("Database connection failed: " . mysqli_connect_error());
    die("Connection failed. Please check the error log.");
}
?>