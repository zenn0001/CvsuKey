<?php
/**
 * Dashboard API - Simplified
 */

// Ensure errors are caught
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $action = $_GET['action'] ?? 'stats';

    switch ($action) {
        case 'stats':
            // Get all dashboard stats
            $stats = [];
            
            // Student counts
            $stmt = $db->query("SELECT COUNT(*) as total, SUM(status = 'Active') as active FROM students");
            $studentStats = $stmt->fetch();
            $stats['total_students'] = (int)$studentStats['total'];
            $stats['active_students'] = (int)$studentStats['active'];
            
            // NFC card counts
            $stmt = $db->query("SELECT COUNT(*) as total, SUM(card_status = 'Active') as active FROM nfc_cards");
            $cardStats = $stmt->fetch();
            $stats['total_cards'] = (int)$cardStats['total'];
            $stats['active_cards'] = (int)$cardStats['active'];
            
            // Wallet stats
            $stmt = $db->query("SELECT SUM(balance) as total_balance, SUM(total_deposited) as total_deposited, SUM(total_spent) as total_spent FROM wallets");
            $walletStats = $stmt->fetch();
            $stats['total_balance'] = (float)$walletStats['total_balance'];
            $stats['total_deposited'] = (float)$walletStats['total_deposited'];
            $stats['total_spent'] = (float)$walletStats['total_spent'];
            
            // Today's transactions
            $stmt = $db->query("SELECT COUNT(*) as count, SUM(amount) as total FROM wallet_transactions WHERE DATE(created_at) = CURDATE()");
            $todayStats = $stmt->fetch();
            $stats['today_transactions'] = (int)$todayStats['count'];
            $stats['today_amount'] = (float)$todayStats['total'];
            
            // Room count
            $stmt = $db->query("SELECT COUNT(*) as total FROM rooms");
            $stats['total_rooms'] = (int)$stmt->fetch()['total'];
            
            ApiResponse::success($stats);
            break;

        case 'recent_activity':
            // Recent transactions
            $stmt = $db->query("
                SELECT 'transaction' as type, wt.transaction_type as action, 
                       CONCAT(s.first_name, ' ', s.last_name) as name,
                       wt.amount, wt.created_at
                FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                JOIN students s ON w.student_number = s.student_number
                ORDER BY wt.created_at DESC
                LIMIT 10
            ");
            $activities = $stmt->fetchAll();
            ApiResponse::success($activities);
            break;

        case 'card_types':
            // Card type distribution
            $stmt = $db->query("
                SELECT card_type, COUNT(*) as count 
                FROM nfc_cards 
                GROUP BY card_type
            ");
            $distribution = $stmt->fetchAll();
            ApiResponse::success($distribution);
            break;

        default:
            ApiResponse::error('Unknown action', 400);
    }
} catch (Exception $e) {
    ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
