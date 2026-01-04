-- =====================================================
-- CVSU KEY NFC System Database Schema (Simplified)
-- Database: cvsukey
-- =====================================================

DROP DATABASE IF EXISTS cvsukey;
CREATE DATABASE cvsukey;
USE cvsukey;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    student_number VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    course VARCHAR(100),
    year_level TINYINT DEFAULT 1,
    section VARCHAR(50),
    gender ENUM('Male', 'Female') DEFAULT 'Male',
    profile_photo VARCHAR(255),
    status ENUM('Active', 'Inactive', 'Graduated') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- NFC Cards Table
CREATE TABLE IF NOT EXISTS nfc_cards (
    card_id INT PRIMARY KEY AUTO_INCREMENT,
    nfc_uid VARCHAR(50) NOT NULL UNIQUE,
    student_number VARCHAR(20),
    card_type ENUM('Full Access', 'Limited Access', 'No Access') DEFAULT 'No Access',
    has_room_access BOOLEAN DEFAULT FALSE,
    has_payment_access BOOLEAN DEFAULT FALSE,
    card_status ENUM('Active', 'Inactive', 'Lost', 'Blocked') DEFAULT 'Active',
    issued_date DATE NOT NULL,
    expiry_date DATE,
    last_used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_number) REFERENCES students(student_number) ON DELETE SET NULL
);

-- Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
    wallet_id INT PRIMARY KEY AUTO_INCREMENT,
    student_number VARCHAR(20) NOT NULL UNIQUE,
    balance DECIMAL(12,2) DEFAULT 0.00,
    total_deposited DECIMAL(12,2) DEFAULT 0.00,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    last_transaction_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_number) REFERENCES students(student_number) ON DELETE CASCADE
);

-- Wallet Transactions Table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    transaction_id INT PRIMARY KEY AUTO_INCREMENT,
    wallet_id INT NOT NULL,
    transaction_type ENUM('Deposit', 'Payment', 'Refund') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    balance_before DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    payment_method ENUM('Cash', 'GCash') DEFAULT 'Cash',
    reference_number VARCHAR(100),
    description VARCHAR(255),
    status ENUM('Completed', 'Pending', 'Failed') DEFAULT 'Completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(wallet_id) ON DELETE CASCADE
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    room_id INT PRIMARY KEY AUTO_INCREMENT,
    room_code VARCHAR(50) NOT NULL UNIQUE,
    room_name VARCHAR(100) NOT NULL,
    room_type ENUM('Classroom', 'Laboratory', 'Library', 'Cafeteria', 'Office') DEFAULT 'Classroom',
    building VARCHAR(100),
    capacity INT DEFAULT 50,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Room Access Logs Table
CREATE TABLE IF NOT EXISTS room_access_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    card_id INT,
    room_id INT,
    access_status ENUM('Granted', 'Denied') NOT NULL,
    denial_reason VARCHAR(100),
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES nfc_cards(card_id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE SET NULL
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('Super Admin', 'Admin', 'Staff') DEFAULT 'Staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

-- Auto-create wallet when student is added
CREATE TRIGGER trg_create_wallet
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    INSERT INTO wallets (student_number, balance) VALUES (NEW.student_number, 0.00);
END //

DELIMITER ;

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_nfc_student ON nfc_cards(student_number);
CREATE INDEX idx_wallet_student ON wallets(student_number);
CREATE INDEX idx_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_access_logs_card ON room_access_logs(card_id);

-- =====================================================
-- SAMPLE DATA (Minimal)
-- =====================================================

-- Sample Admin (password: admin123)
INSERT INTO admin_users (username, password_hash, first_name, last_name, email, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System', 'Admin', 'admin@cvsu.edu.ph', 'Super Admin');

-- Sample Rooms
INSERT INTO rooms (room_code, room_name, room_type, building, capacity) VALUES
('CEIT-101', 'Computer Lab 1', 'Laboratory', 'CEIT Building', 40),
('CEIT-102', 'Computer Lab 2', 'Laboratory', 'CEIT Building', 40),
('CEIT-201', 'Lecture Room 1', 'Classroom', 'CEIT Building', 50),
('LIB-001', 'Main Library', 'Library', 'Library Building', 200),
('CAFE-001', 'Main Cafeteria', 'Cafeteria', 'Student Center', 300);

-- Sample Students (just 3 for testing)
INSERT INTO students (student_number, first_name, middle_name, last_name, email, course, year_level, section, gender) VALUES
('202310001', 'Yuji', 'M', 'Itadori', 'yuji.itadori@cvsu.edu.ph', 'BSIT', 2, 'BSIT 2-1', 'Male'),
('202310002', 'Megumi', 'S', 'Fushiguro', 'megumi.fushiguro@cvsu.edu.ph', 'BSCS', 2, 'BSCS 2-1', 'Male'),
('202310003', 'Nobara', 'K', 'Kugisaki', 'nobara.kugisaki@cvsu.edu.ph', 'BSIT', 2, 'BSIT 2-1', 'Female');

-- Sample NFC Cards
INSERT INTO nfc_cards (nfc_uid, student_number, card_type, has_room_access, has_payment_access, card_status, issued_date, expiry_date) VALUES
('04A1B2C3D4', '202310001', 'Full Access', TRUE, TRUE, 'Active', '2024-01-15', '2028-01-15'),
('04B2C3D4E5', '202310002', 'Limited Access', TRUE, FALSE, 'Active', '2024-01-16', '2028-01-16'),
('04C3D4E5F6', '202310003', 'No Access', FALSE, FALSE, 'Active', '2024-01-17', '2028-01-17');

-- Sample Wallet Transactions (just 2 for testing)
INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, balance_before, balance_after, payment_method, reference_number, description) VALUES
(1, 'Deposit', 500.00, 0.00, 500.00, 'Cash', NULL, 'Initial deposit'),
(1, 'Payment', 50.00, 500.00, 450.00, 'Cash', NULL, 'Cafeteria purchase');

-- Update wallet balance for student 1
UPDATE wallets SET balance = 450.00, total_deposited = 500.00, total_spent = 50.00 WHERE student_number = '202310001';

-- =====================================================
-- END OF SCHEMA
-- =====================================================
-- =====================================================
