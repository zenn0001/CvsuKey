<?php
/**
 * Students API - Simplified (using student_number as primary key)
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? 'list';
    $id = $_GET['id'] ?? null;  // This is now student_number

    switch ($method) {
        case 'GET':
            if ($action === 'search' && isset($_GET['q'])) {
                // Search students
                $query = '%' . $_GET['q'] . '%';
                $stmt = $db->prepare("
                    SELECT s.*, nc.nfc_uid, nc.card_type, nc.card_status, w.balance
                    FROM students s
                    LEFT JOIN nfc_cards nc ON nc.student_number = s.student_number
                    LEFT JOIN wallets w ON w.student_number = s.student_number
                    WHERE s.student_number LIKE ? 
                    OR s.first_name LIKE ? 
                    OR s.last_name LIKE ?
                    OR s.email LIKE ?
                    LIMIT 20
                ");
                $stmt->execute([$query, $query, $query, $query]);
                $students = $stmt->fetchAll();
                ApiResponse::success($students);
            } elseif ($id) {
                // Get single student by student_number
                $stmt = $db->prepare("
                    SELECT s.*, nc.nfc_uid, nc.card_type, nc.card_status, 
                           nc.has_room_access, nc.has_payment_access,
                           w.balance, w.total_deposited, w.total_spent
                    FROM students s
                    LEFT JOIN nfc_cards nc ON nc.student_number = s.student_number
                    LEFT JOIN wallets w ON w.student_number = s.student_number
                    WHERE s.student_number = ?
                ");
                $stmt->execute([$id]);
                $student = $stmt->fetch();
                if ($student) {
                    ApiResponse::success($student);
                } else {
                    ApiResponse::error('Student not found', 404);
                }
            } else {
                // Get all students
                $stmt = $db->query("
                    SELECT s.*, nc.nfc_uid, nc.card_type, nc.card_status, w.balance
                    FROM students s
                    LEFT JOIN nfc_cards nc ON nc.student_number = s.student_number
                    LEFT JOIN wallets w ON w.student_number = s.student_number
                    ORDER BY s.created_at DESC
                    LIMIT 100
                ");
                $students = $stmt->fetchAll();
                ApiResponse::success($students);
            }
            break;

        case 'POST':
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Start transaction for student + optional NFC card + wallet
            $db->beginTransaction();
            
            try {
                // Create student
                $stmt = $db->prepare("
                    INSERT INTO students (student_number, first_name, middle_name, last_name, email, phone_number, course, year_level, section, gender)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $data['student_number'],
                    $data['first_name'],
                    $data['middle_name'] ?? null,
                    $data['last_name'],
                    $data['email'] ?? null,
                    $data['phone'] ?? $data['phone_number'] ?? null,
                    $data['course'] ?? null,
                    $data['year_level'] ?? 1,
                    $data['section'] ?? null,
                    $data['gender'] ?? 'Male'
                ]);

                // Create wallet for student
                $stmt = $db->prepare("INSERT INTO wallets (student_number, balance) VALUES (?, 0)");
                $stmt->execute([$data['student_number']]);

                // Create NFC card if provided
                if (!empty($data['nfc_uid'])) {
                    $cardType = $data['card_type'] ?? 'Full Access';
                    
                    // Use explicit values if provided, otherwise calculate from card type
                    if (isset($data['has_room_access'])) {
                        $hasRoomAccess = $data['has_room_access'] ? 1 : 0;
                    } else {
                        $hasRoomAccess = ($cardType === 'Full Access' || $cardType === 'Limited Access') ? 1 : 0;
                    }
                    
                    if (isset($data['has_payment_access'])) {
                        $hasPaymentAccess = $data['has_payment_access'] ? 1 : 0;
                    } else {
                        $hasPaymentAccess = ($cardType === 'Full Access') ? 1 : 0;
                    }
                    
                    $cardStatus = $data['card_status'] ?? 'Active';
                    $issuedDate = date('Y-m-d');
                    $expiryDate = date('Y-m-d', strtotime('+4 years'));
                    
                    $stmt = $db->prepare("
                        INSERT INTO nfc_cards (nfc_uid, student_number, card_type, has_room_access, has_payment_access, card_status, issued_date, expiry_date)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ");
                    $stmt->execute([
                        $data['nfc_uid'],
                        $data['student_number'],
                        $cardType,
                        $hasRoomAccess,
                        $hasPaymentAccess,
                        $cardStatus,
                        $issuedDate,
                        $expiryDate
                    ]);
                }

                $db->commit();
                ApiResponse::success(['student_number' => $data['student_number']], 'Student created successfully', 201);
            } catch (Exception $e) {
                $db->rollBack();
                ApiResponse::error('Failed to create student: ' . $e->getMessage(), 500);
            }
            break;

        case 'PUT':
            if (!$id) ApiResponse::error('Student number required', 400);
            $data = json_decode(file_get_contents('php://input'), true);
            $stmt = $db->prepare("
                UPDATE students SET 
                    first_name = ?, middle_name = ?, last_name = ?,
                    email = ?, phone_number = ?, course = ?,
                    year_level = ?, section = ?, gender = ?, status = ?
                WHERE student_number = ?
            ");
            $stmt->execute([
                $data['first_name'],
                $data['middle_name'] ?? null,
                $data['last_name'],
                $data['email'] ?? null,
                $data['phone_number'] ?? null,
                $data['course'] ?? null,
                $data['year_level'] ?? 1,
                $data['section'] ?? null,
                $data['gender'] ?? 'Male',
                $data['status'] ?? 'Active',
                $id
            ]);
            ApiResponse::success(null, 'Student updated');
            break;

        case 'DELETE':
            if (!$id) ApiResponse::error('Student number required', 400);
            $stmt = $db->prepare("DELETE FROM students WHERE student_number = ?");
            $stmt->execute([$id]);
            ApiResponse::success(null, 'Student deleted');
            break;

        default:
            ApiResponse::error('Method not allowed', 405);
    }
} catch (Exception $e) {
    ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
