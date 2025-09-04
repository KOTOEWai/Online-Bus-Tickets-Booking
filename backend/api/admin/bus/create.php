<?php
include('../../../db/BusDb.php');
include('../../../api/cors.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bus_number = $_POST['bus_number'];
    $bus_type = $_POST['bus_type'];
    $total_seats = $_POST['total_seats'];
    $opertor_name = $_POST['opertor_name'];
    $description = $_POST['description'];

    // Handle image upload
    $image_path = '';
    if (isset($_FILES['bus_image']) && $_FILES['bus_image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = '../../../uploads/buses/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true); // Create uploads folder if not exist
        }

        // Allowed extensions
        $allowed_ext = ['jpg', 'jpeg', 'png', 'gif'];
        $ext = strtolower(pathinfo($_FILES['bus_image']['name'], PATHINFO_EXTENSION));

        // Check extension
        if (!in_array($ext, $allowed_ext)) {
            echo json_encode(["status" => "error", "message" => "Only JPG, JPEG, PNG, and GIF files are allowed."]);
            exit;
        }

        // Extra check: MIME type
        $allowed_mime = ['image/jpeg', 'image/png', 'image/gif'];
        $file_mime = mime_content_type($_FILES['bus_image']['tmp_name']);
        if (!in_array($file_mime, $allowed_mime)) {
            echo json_encode(["status" => "error", "message" => "Invalid image type."]);
            exit;
        }

        // Generate unique filename
        $filename = uniqid('bus_', true) . '.' . $ext;
        $target_path = $upload_dir . $filename;

        if (move_uploaded_file($_FILES['bus_image']['tmp_name'], $target_path)) {
            $image_path = 'uploads/buses/' . $filename; // relative path for frontend
        } else {
            echo json_encode(["status" => "error", "message" => "Image upload failed"]);
            exit;
        }
    }

    // Insert bus data with image path
    $stmt = $conn->prepare("INSERT INTO buses (bus_number, bus_type, total_seats, opertor_name, description, image)
                            VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssisss", $bus_number, $bus_type, $total_seats, $opertor_name, $description, $image_path);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Bus added successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Insert failed"]);
    }
}
?>
