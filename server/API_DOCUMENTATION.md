# CVSU Key NFC System - API Documentation

## Overview

The CVSU Key NFC System API provides endpoints for managing students, NFC cards, wallets, rooms, and transactions. All API responses are in JSON format.

**Base URL:** `http://localhost/CvsuKey/server/endpoints/`

## Response Format

All responses follow this structure:

```json
{
    "success": true,
    "message": "Success",
    "data": { ... }
}
```

Error responses:
```json
{
    "success": false,
    "message": "Error message",
    "errors": [ ... ]
}
```

---

## Authentication

Currently, the API does not require authentication. For production, implement JWT or session-based authentication.

---

## Endpoints

### 1. Students API

**File:** `students.php`

#### Get All Students
```http
GET /students.php?page=1&limit=20&status=Active
```

**Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 20
- `status` (optional): Filter by status (Active, Inactive, Graduated, Suspended)

#### Get Student by ID
```http
GET /students.php?id=1
```

#### Get Student by NFC UID
```http
GET /students.php?action=nfc&uid=04A1B2C3D4
```

#### Search Students
```http
GET /students.php?action=search&q=John&limit=20
```

#### Get Student Statistics
```http
GET /students.php?action=statistics
```

#### Create Student
```http
POST /students.php
Content-Type: application/json

{
    "student_number": "2024-0001",
    "first_name": "John",
    "middle_name": "Doe",
    "last_name": "Smith",
    "gender": "Male",
    "email": "john.smith@cvsu.edu.ph",
    "phone_number": "09123456789",
    "section_id": 1,
    "nfc_uid": "04A1B2C3D4",
    "card_type": "Full Access",
    "has_room_access": true,
    "has_payment_access": true
}
```

#### Update Student
```http
PUT /students.php?id=1
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Smith",
    "status": "Active",
    ...
}
```

#### Delete Student
```http
DELETE /students.php?id=1
```

---

### 2. NFC Cards API

**File:** `nfc_cards.php`

#### Get All NFC Cards
```http
GET /nfc_cards.php?page=1&limit=20&status=Active
```

#### Get NFC Card by ID
```http
GET /nfc_cards.php?id=1
```

#### Get NFC Card by UID
```http
GET /nfc_cards.php?action=uid&uid=04A1B2C3D4
```

#### Get Card Statistics
```http
GET /nfc_cards.php?action=statistics
```

#### Register New NFC Card
```http
POST /nfc_cards.php
Content-Type: application/json

{
    "nfc_uid": "04A1B2C3D4",
    "student_id": 1,
    "card_type": "Full Access",
    "has_room_access": true,
    "has_payment_access": true,
    "has_library_access": true,
    "has_lab_access": true
}
```

#### Process NFC Tap (Room Access)
```http
POST /nfc_cards.php?action=tap
Content-Type: application/json

{
    "nfc_uid": "04A1B2C3D4",
    "room_id": 1
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "access_granted": true,
        "message": "Access granted",
        "student": {
            "student_number": "2024-0001",
            "student_name": "John Smith",
            "section_name": "BSIT 1-1",
            "course_code": "BSIT"
        },
        "schedule": {
            "subject": "Programming 1",
            "instructor": "Prof. Santos",
            "room": "Computer Laboratory 1"
        }
    }
}
```

#### Deactivate NFC Card
```http
POST /nfc_cards.php?action=deactivate
Content-Type: application/json

{
    "card_id": 1,
    "reason": "Lost"
}
```

---

### 3. Wallet API

**File:** `wallet.php`

#### Get Wallet by Student ID
```http
GET /wallet.php?student_id=1
```

#### Get Wallet by NFC UID
```http
GET /wallet.php?nfc_uid=04A1B2C3D4
```

#### Get Wallet Statistics
```http
GET /wallet.php?action=statistics
```

#### Get Transactions
```http
GET /wallet.php?action=transactions&wallet_id=1&page=1&limit=20
```

**Filter Parameters:**
- `type`: Deposit, Payment, Refund, etc.
- `status`: Pending, Completed, Failed, Cancelled
- `date_from`: YYYY-MM-DD
- `date_to`: YYYY-MM-DD
- `service`: Service type

#### Add Funds (Deposit)
```http
POST /wallet.php?action=deposit
Content-Type: application/json

{
    "student_id": 1,
    "amount": 500.00,
    "payment_method": "Cash",
    "reference_number": "REF-12345",
    "description": "Wallet top-up",
    "processed_by": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": "Funds added successfully",
    "data": {
        "transaction_id": 123,
        "student_id": 1,
        "amount_deposited": 500.00,
        "previous_balance": 100.00,
        "new_balance": 600.00,
        "payment_method": "Cash"
    }
}
```

#### Make Payment
```http
POST /wallet.php?action=payment
Content-Type: application/json

{
    "nfc_uid": "04A1B2C3D4",
    "service_id": 1,
    "amount": 50.00,
    "quantity": 2,
    "notes": "Lunch purchase"
}
```

---

### 4. Rooms API

**File:** `rooms.php`

#### Get All Rooms
```http
GET /rooms.php?page=1&limit=20&building_id=1&room_type=Laboratory
```

#### Get Room by ID
```http
GET /rooms.php?id=1
```

#### Get All Buildings
```http
GET /rooms.php?action=buildings
```

#### Get Room Schedules
```http
GET /rooms.php?action=schedules&room_id=1&day=Monday
```

#### Get Room Access Logs
```http
GET /rooms.php?action=access-logs&room_id=1&page=1&date_from=2024-01-01&date_to=2024-12-31
```

#### Get Room Statistics
```http
GET /rooms.php?action=statistics
```

#### Create Room
```http
POST /rooms.php
Content-Type: application/json

{
    "building_id": 1,
    "room_code": "CEIT-301",
    "room_name": "Computer Laboratory 3",
    "room_type": "Laboratory",
    "floor_number": 3,
    "capacity": 40,
    "has_nfc_reader": true
}
```

#### Create Room Schedule
```http
POST /rooms.php?action=schedule
Content-Type: application/json

{
    "room_id": 1,
    "section_id": 1,
    "subject_code": "CC101",
    "subject_name": "Programming 1",
    "instructor_name": "Prof. Santos",
    "day_of_week": "Monday",
    "start_time": "08:00:00",
    "end_time": "10:00:00",
    "academic_year": "2024-2025",
    "semester": "1st"
}
```

---

### 5. Transactions API

**File:** `transactions.php`

#### Get All Transactions
```http
GET /transactions.php?page=1&limit=20
```

**Filter Parameters:**
- `type`: Deposit, Payment, Withdrawal, Refund
- `status`: Pending, Completed, Failed, Cancelled
- `payment_method`: Cash, GCash, Bank Transfer
- `service_type`: Cafeteria, Library, Printing, etc.
- `date_from`: YYYY-MM-DD
- `date_to`: YYYY-MM-DD
- `student_id`: Filter by student

#### Get Transaction by ID
```http
GET /transactions.php?id=123
```

#### Get Transactions by Student
```http
GET /transactions.php?action=student&student_id=1&page=1&limit=20
```

#### Get Service Transactions
```http
GET /transactions.php?action=services&service_type=Cafeteria&page=1
```

#### Get Transaction Summary
```http
GET /transactions.php?action=summary&date_from=2024-01-01&date_to=2024-12-31
```

#### Get Available Services
```http
GET /transactions.php?action=service-list
```

---

### 6. Dashboard API

**File:** `dashboard.php`

#### Get Dashboard Statistics
```http
GET /dashboard.php?action=stats
```

**Response:**
```json
{
    "success": true,
    "data": {
        "students": {
            "total": 3240,
            "active": 3100,
            "present_today": 124
        },
        "nfc_cards": {
            "total": 3000,
            "active": 2800
        },
        "wallet": {
            "total_funds": 2456780.00,
            "total_deposited": 5000000.00,
            "total_spent": 2543220.00
        },
        "today": {
            "transactions": 156,
            "deposits": 45600.00,
            "payments": 23400.00,
            "room_access_granted": 450,
            "room_access_denied": 12
        }
    }
}
```

#### Get Recent Activity
```http
GET /dashboard.php?action=activity&limit=10
```

#### Get Chart Data
```http
GET /dashboard.php?action=charts&type=weekly
```

#### Get Notifications
```http
GET /dashboard.php?action=notifications&limit=10
```

---

## Database Setup

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create database: `cvsukey`
3. Import the schema file: `database/cvsukey_schema.sql`

Or run via MySQL command:
```sql
mysql -u root -p < database/cvsukey_schema.sql
```

---

## Configuration

Edit `server/config/database.php` to update:
- `DB_HOST`: Database host (default: localhost)
- `DB_NAME`: Database name (default: cvsukey)
- `DB_USER`: MySQL username (default: root)
- `DB_PASS`: MySQL password (default: empty)

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 404 | Not Found |
| 405 | Method Not Allowed |
| 500 | Server Error |

---

## NFC Card Types

| Type | Description |
|------|-------------|
| Full Access | Complete access to all features |
| Limited Access | Restricted to certain features |
| No Access | Card registered but no privileges |

---

## Card Access Privileges

- **has_room_access**: Can enter rooms via NFC tap
- **has_payment_access**: Can make payments using the card
- **has_library_access**: Can use library services
- **has_lab_access**: Can access laboratory rooms

---

## Sample Test Data

The schema includes sample data for:
- 7 Departments (CEIT, CAS, CED, etc.)
- 8 Courses (BSIT, BSCS, BSCE, etc.)
- 6 Sections
- 5 Buildings
- 6 Rooms
- 7 Services
- 1 Admin user (username: admin, password: admin123)
