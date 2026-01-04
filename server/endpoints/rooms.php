<?php
/**
 * Rooms API - Simplified
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $id = $_GET['id'] ?? null;
    $action = $_GET['action'] ?? 'list';

    switch ($method) {
        case 'GET':
            if ($action === 'logs' && $id) {
                // Get access logs for a room
                $stmt = $db->prepare("
                    SELECT ral.*, nc.nfc_uid, s.student_number, s.first_name, s.last_name
                    FROM room_access_logs ral
                    LEFT JOIN nfc_cards nc ON ral.card_id = nc.card_id
                    LEFT JOIN students s ON nc.student_number = s.student_number
                    WHERE ral.room_id = ?
                    ORDER BY ral.access_time DESC
                    LIMIT 50
                ");
                $stmt->execute([$id]);
                $logs = $stmt->fetchAll();
                ApiResponse::success($logs);
            } elseif ($id) {
                $stmt = $db->prepare("SELECT * FROM rooms WHERE room_id = ?");
                $stmt->execute([$id]);
                $room = $stmt->fetch();
                ApiResponse::success($room);
            } else {
                $stmt = $db->query("SELECT * FROM rooms ORDER BY room_code");
                $rooms = $stmt->fetchAll();
                ApiResponse::success($rooms);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("
                INSERT INTO rooms (room_code, room_name, room_type, building, capacity)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $data['room_code'],
                $data['room_name'],
                $data['room_type'] ?? 'Classroom',
                $data['building'] ?? null,
                $data['capacity'] ?? 50
            ]);
            ApiResponse::success(['room_id' => $db->lastInsertId()], 'Room created', 201);
            break;

        case 'PUT':
            if (!$id) ApiResponse::error('Room ID required', 400);
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("
                UPDATE rooms SET room_name = ?, room_type = ?, building = ?, capacity = ?, status = ?
                WHERE room_id = ?
            ");
            $stmt->execute([
                $data['room_name'],
                $data['room_type'] ?? 'Classroom',
                $data['building'] ?? null,
                $data['capacity'] ?? 50,
                $data['status'] ?? 'Available',
                $id
            ]);
            ApiResponse::success(null, 'Room updated');
            break;

        case 'DELETE':
            if (!$id) ApiResponse::error('Room ID required', 400);
            $stmt = $db->prepare("DELETE FROM rooms WHERE room_id = ?");
            $stmt->execute([$id]);
            ApiResponse::success(null, 'Room deleted');
            break;

        default:
            ApiResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
