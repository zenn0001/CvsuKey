<?php
/**
 * NFC Cards API - Simplified (using student_number as primary key)
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? 'list';
    $id = $_GET['id'] ?? null;
    $uid = $_GET['uid'] ?? null;

    switch ($method) {
        case 'GET':
            if ($uid) {
                // Get card by NFC UID (for tap simulation)
                $stmt = $db->prepare("
                    SELECT nc.*, s.student_number, s.first_name, s.last_name, s.course, w.balance
                    FROM nfc_cards nc
                    LEFT JOIN students s ON nc.student_number = s.student_number
                    LEFT JOIN wallets w ON s.student_number = w.student_number
                    WHERE nc.nfc_uid = ?
                ");
                $stmt->execute([$uid]);
                $card = $stmt->fetch();
                if ($card) {
                    // Update last used
                    $db->prepare("UPDATE nfc_cards SET last_used_at = NOW() WHERE nfc_uid = ?")->execute([$uid]);
                    ApiResponse::success($card);
                } else {
                    ApiResponse::error('Card not found', 404);
                }
            } elseif ($id) {
                // Get single card
                $stmt = $db->prepare("
                    SELECT nc.*, s.student_number, s.first_name, s.last_name
                    FROM nfc_cards nc
                    LEFT JOIN students s ON nc.student_number = s.student_number
                    WHERE nc.card_id = ?
                ");
                $stmt->execute([$id]);
                $card = $stmt->fetch();
                ApiResponse::success($card);
            } else {
                // Get all cards
                $stmt = $db->query("
                    SELECT nc.*, s.student_number, s.first_name, s.last_name
                    FROM nfc_cards nc
                    LEFT JOIN students s ON nc.student_number = s.student_number
                    ORDER BY nc.created_at DESC
                    LIMIT 100
                ");
                $cards = $stmt->fetchAll();
                ApiResponse::success($cards);
            }
            break;

        case 'POST':
            if ($action === 'access') {
                // Process room access
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $db->prepare("SELECT * FROM nfc_cards WHERE nfc_uid = ?");
                $stmt->execute([$data['nfc_uid']]);
                $card = $stmt->fetch();
                
                if (!$card) {
                    ApiResponse::error('Card not found', 404);
                }
                if ($card['card_status'] !== 'Active') {
                    ApiResponse::error('Card is ' . $card['card_status'], 403);
                }
                if (!$card['has_room_access']) {
                    ApiResponse::error('No room access privilege', 403);
                }
                
                // Log access
                $stmt = $db->prepare("INSERT INTO room_access_logs (card_id, room_id, access_status) VALUES (?, ?, 'Granted')");
                $stmt->execute([$card['card_id'], $data['room_id']]);
                
                ApiResponse::success(['access' => 'granted'], 'Access granted');
            } else {
                // Create new card
                $data = json_decode(file_get_contents('php://input'), true);
                $stmt = $db->prepare("
                    INSERT INTO nfc_cards (nfc_uid, student_number, card_type, has_room_access, has_payment_access, issued_date, expiry_date)
                    VALUES (?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 YEAR))
                ");
                $stmt->execute([
                    $data['nfc_uid'],
                    $data['student_number'],
                    $data['card_type'] ?? 'No Access',
                    $data['has_room_access'] ?? false,
                    $data['has_payment_access'] ?? false
                ]);
                ApiResponse::success(['card_id' => $db->lastInsertId()], 'Card created', 201);
            }
            break;

        case 'PUT':
            if (!$id) ApiResponse::error('Card ID required', 400);
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("
                UPDATE nfc_cards SET 
                    card_type = ?, has_room_access = ?, has_payment_access = ?, card_status = ?
                WHERE card_id = ?
            ");
            $stmt->execute([
                $data['card_type'],
                $data['has_room_access'] ?? false,
                $data['has_payment_access'] ?? false,
                $data['card_status'] ?? 'Active',
                $id
            ]);
            ApiResponse::success(null, 'Card updated');
            break;

        default:
            ApiResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
