<?php
/**
 * Transactions API - Simplified
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $action = $_GET['action'] ?? 'list';
    $limit = min($_GET['limit'] ?? 50, 100);

    switch ($action) {
        case 'recent':
            $stmt = $db->prepare("
                SELECT wt.*, s.student_number, s.first_name, s.last_name
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                JOIN students s ON w.student_number = s.student_number
                ORDER BY wt.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$limit]);
            $transactions = $stmt->fetchAll();
            ApiResponse::success($transactions);
            break;

        case 'deposits':
            $stmt = $db->prepare("
                SELECT wt.*, s.student_number, s.first_name, s.last_name
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                JOIN students s ON w.student_number = s.student_number
                WHERE wt.transaction_type = 'Deposit'
                ORDER BY wt.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$limit]);
            $transactions = $stmt->fetchAll();
            ApiResponse::success($transactions);
            break;

        case 'payments':
            $stmt = $db->prepare("
                SELECT wt.*, s.student_number, s.first_name, s.last_name
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                JOIN students s ON w.student_number = s.student_number
                WHERE wt.transaction_type = 'Payment'
                ORDER BY wt.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$limit]);
            $transactions = $stmt->fetchAll();
            ApiResponse::success($transactions);
            break;

        case 'today':
            $stmt = $db->query("
                SELECT wt.*, s.student_number, s.first_name, s.last_name
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                JOIN students s ON w.student_number = s.student_number
                WHERE DATE(wt.created_at) = CURDATE()
                ORDER BY wt.created_at DESC
            ");
            $transactions = $stmt->fetchAll();
            ApiResponse::success($transactions);
            break;

        default:
            // All transactions
            $stmt = $db->prepare("
                SELECT wt.*, s.student_number, s.first_name, s.last_name
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                JOIN students s ON w.student_number = s.student_number
                ORDER BY wt.created_at DESC
                LIMIT ?
            ");
            $stmt->execute([$limit]);
            $transactions = $stmt->fetchAll();
            ApiResponse::success($transactions);
    }
} catch (Exception $e) {
    ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
