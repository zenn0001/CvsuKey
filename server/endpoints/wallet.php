<?php
/**
 * Wallet API - Simplified (using student_number as primary key)
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? 'list';
    $studentNumber = $_GET['student_number'] ?? $_GET['student_id'] ?? null;

    switch ($action) {
        case 'balance':
            if (!$studentNumber) ApiResponse::error('Student number required', 400);
            $stmt = $db->prepare("SELECT * FROM wallets WHERE student_number = ?");
            $stmt->execute([$studentNumber]);
            $wallet = $stmt->fetch();
            ApiResponse::success($wallet);
            break;

        case 'deposit':
            if ($method !== 'POST') ApiResponse::error('POST required', 405);
            $data = json_decode(file_get_contents('php://input'), true);
            
            $studentNum = $data['student_number'] ?? $data['student_id'] ?? null;
            if (!$studentNum) ApiResponse::error('Student number is required', 400);
            if (!isset($data['amount']) || $data['amount'] <= 0) ApiResponse::error('Valid amount is required', 400);
            
            // Get current balance
            $stmt = $db->prepare("SELECT wallet_id, balance FROM wallets WHERE student_number = ?");
            $stmt->execute([$studentNum]);
            $wallet = $stmt->fetch();
            
            if (!$wallet) ApiResponse::error('Student wallet not found. Please verify the student number.', 404);
            
            $newBalance = $wallet['balance'] + $data['amount'];
            if ($newBalance > 50000) ApiResponse::error('Maximum balance is ₱50,000', 400);
            
            // Update balance
            $stmt = $db->prepare("UPDATE wallets SET balance = balance + ?, total_deposited = total_deposited + ?, last_transaction_at = NOW() WHERE wallet_id = ?");
            $stmt->execute([$data['amount'], $data['amount'], $wallet['wallet_id']]);
            
            // Record transaction
            $stmt = $db->prepare("INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, balance_before, balance_after, payment_method, reference_number, description) VALUES (?, 'Deposit', ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $wallet['wallet_id'],
                $data['amount'],
                $wallet['balance'],
                $newBalance,
                $data['payment_method'] ?? 'Cash',
                $data['reference_number'] ?? null,
                $data['description'] ?? 'Wallet deposit'
            ]);
            
            ApiResponse::success(['new_balance' => $newBalance], 'Deposit successful');
            break;

        case 'transactions':
            if (!$studentNumber) ApiResponse::error('Student number required', 400);
            $stmt = $db->prepare("
                SELECT wt.* FROM wallet_transactions wt
                JOIN wallets w ON wt.wallet_id = w.wallet_id
                WHERE w.student_number = ?
                ORDER BY wt.created_at DESC
                LIMIT 50
            ");
            $stmt->execute([$studentNumber]);
            $transactions = $stmt->fetchAll();
            ApiResponse::success($transactions);
            break;

        case 'stats':
            $stmt = $db->query("
                SELECT 
                    COUNT(*) as total_wallets,
                    SUM(balance) as total_balance,
                    SUM(total_deposited) as total_deposited,
                    SUM(total_spent) as total_spent
                FROM wallets
            ");
            $stats = $stmt->fetch();
            ApiResponse::success($stats);
            break;

        default:
            // List all wallets with student info
            $stmt = $db->query("
                SELECT w.*, s.student_number, s.first_name, s.last_name
                FROM wallets w
                JOIN students s ON w.student_number = s.student_number
                ORDER BY w.balance DESC
                LIMIT 100
            ");
            $wallets = $stmt->fetchAll();
            ApiResponse::success($wallets);
    }
} catch (Exception $e) {
    ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
