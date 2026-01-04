<?php
// Simple test file to check PHP and database connection

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

echo json_encode([
    'php_working' => true,
    'php_version' => PHP_VERSION
]);

// Now test database
try {
    $dsn = "mysql:host=localhost;dbname=cvsukey;charset=utf8mb4";
    $pdo = new PDO($dsn, 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Test query
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM students");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'database_working' => true,
        'student_count' => $result['count']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'database_working' => false,
        'error' => $e->getMessage()
    ]);
}
