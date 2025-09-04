<?php
include('./cors.php');


include '../db/BusDb.php';


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
    // In a real application, you would include your database connection here
    // include '../../db/BusDb.php';
    // And query the 'destinations' table based on destination_id

    $destination_id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);

    if ($destination_id === false || $destination_id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid destination ID provided."]);
        exit();
    }

    // --- Mock Data for Demonstration ---
    // In a real scenario, this would come from your database
    $mock_destinations = [
        1 => [
            'destination_id' => 1,
            'name' => 'Yangon',
            'description' => 'Yangon, Myanmar\'s largest city, is known for its bustling streets, colonial architecture, and the magnificent Shwedagon Pagoda. It serves as the country\'s main economic and cultural hub.',
            'image_url' => 'https://cdn.britannica.com/11/94611-050-8A500304/Sule-pagoda-centre-Myanmar-Yangon.jpg', // Placeholder image
            'latitude' => 16.8409,
            'longitude' => 96.1735,
            'popular_attractions' => ['Shwedagon Pagoda', 'Sule Pagoda', 'Bogyoke Aung San Market', 'Inya Lake'],
            'related_routes' => [ // Example of related routes
                ['start' => 'Yangon', 'end' => 'Mandalay', 'price' => 35000],
                ['start' => 'Yangon', 'end' => 'Bagan', 'price' => 25000],
            ]
        ],
        2 => [
            'destination_id' => 2,
            'name' => 'Mandalay',
            'description' => 'Mandalay, the last royal capital of Myanmar, is a city of rich cultural heritage, ancient monasteries, and the iconic Mandalay Hill. It\'s a center for traditional arts and crafts.',
            'image_url' => 'https://hanoivoyage.com/uploads/Blogs/Myanmar/Mandalay/mandalay-palace-02.jpg', // Placeholder image
            'latitude' => 21.96109,
            'longitude' => 96.11397,
            'popular_attractions' => ['Mandalay Hill', 'Kuthodaw Pagoda', 'U Bein Bridge', 'Mandalay Palace'],
            'related_routes' => [
                ['start' => 'Mandalay', 'end' => 'Yangon', 'price' => 35000],
                ['start' => 'Mandalay', 'end' => 'Bagan', 'price' => 15000],
            ]
        ],
        3 => [
            'destination_id' => 3,
            'name' => 'Bagan',
            'description' => 'Bagan is an ancient city in central Myanmar, famous for its thousands of Buddhist temples, pagodas, and stupas, offering breathtaking sunrise and sunset views over the plains.Bagan is famous for its thousands of temples that were built from the 9th to 11th centuries. The city was the capital of the Pagan Empire and was the cultural and political center of Myanmar during this time.',
            'image_url' => 'https://i.natgeofe.com/n/95f6d0ed-f811-4fdd-a7e4-0f9deb74c083/Bagan2.jpg', // Placeholder image
            'latitude' => 21.1667,
            'longitude' => 94.8667,
            'popular_attractions' => ['Ananda Temple', 'Shwesandaw Pagoda', 'Thatbyinnyu Temple', 'Dhammayangyi Temple'],
            'related_routes' => [
                ['start' => 'Bagan', 'end' => 'Yangon', 'price' => 25000],
                ['start' => 'Bagan', 'end' => 'Mandalay', 'price' => 15000],
            ]
        ]
    ];
    // --- End Mock Data ---

    $destination_data = $mock_destinations[$destination_id] ?? null;

    if (!$destination_data) {
        http_response_code(404);
        echo json_encode(["error" => "Destination not found."]);
        exit();
    }

    http_response_code(200);
    echo json_encode($destination_data);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
    error_log("PHP getDestinationDetails Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}
?>
