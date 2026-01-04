/**
 * CVSU Key API Client - Simplified
 * 
 * IMPORTANT: Update API_BASE_URL to match your local setup
 */

// ====== CHANGE THIS TO YOUR LOCAL SETUP ======
const API_BASE_URL = '/CvsuKey/server/endpoints';
// Examples:
// - XAMPP: '/CvsuKey/server/endpoints'
// - Custom path: '/your-folder/server/endpoints'
// ==============================================

/**
 * Make API request
 */
async function apiRequest(endpoint, method = 'GET', data = null, params = {}) {
    let url = `${API_BASE_URL}/${endpoint}`;
    
    // Add query parameters
    const queryParams = new URLSearchParams(params);
    if (queryParams.toString()) {
        url += '?' + queryParams.toString();
    }

    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return response.json();
}

// ====== STUDENTS API ======
const StudentsAPI = {
    getAll: () => apiRequest('students.php'),
    getById: (id) => apiRequest('students.php', 'GET', null, { id }),
    search: (query) => apiRequest('students.php', 'GET', null, { action: 'search', q: query }),
    create: (data) => apiRequest('students.php', 'POST', data),
    update: (id, data) => apiRequest('students.php', 'PUT', data, { id }),
    delete: (id) => apiRequest('students.php', 'DELETE', null, { id })
};

// ====== WALLET API ======
const WalletAPI = {
    getAll: () => apiRequest('wallet.php'),
    getBalance: (studentId) => apiRequest('wallet.php', 'GET', null, { action: 'balance', student_id: studentId }),
    deposit: (studentId, amount, paymentMethod = 'Cash', refNumber = null) => 
        apiRequest('wallet.php', 'POST', { 
            student_id: studentId, 
            amount, 
            payment_method: paymentMethod,
            reference_number: refNumber
        }, { action: 'deposit' }),
    getTransactions: (studentId) => apiRequest('wallet.php', 'GET', null, { action: 'transactions', student_id: studentId }),
    getStats: () => apiRequest('wallet.php', 'GET', null, { action: 'stats' })
};

// ====== NFC CARDS API ======
const NfcCardsAPI = {
    getAll: () => apiRequest('nfc_cards.php'),
    getById: (id) => apiRequest('nfc_cards.php', 'GET', null, { id }),
    getByUid: (uid) => apiRequest('nfc_cards.php', 'GET', null, { uid }),
    create: (data) => apiRequest('nfc_cards.php', 'POST', data),
    update: (id, data) => apiRequest('nfc_cards.php', 'PUT', data, { id }),
    processAccess: (nfcUid, roomId) => apiRequest('nfc_cards.php', 'POST', { nfc_uid: nfcUid, room_id: roomId }, { action: 'access' })
};

// ====== ROOMS API ======
const RoomsAPI = {
    getAll: () => apiRequest('rooms.php'),
    getById: (id) => apiRequest('rooms.php', 'GET', null, { id }),
    getLogs: (roomId) => apiRequest('rooms.php', 'GET', null, { id: roomId, action: 'logs' }),
    create: (data) => apiRequest('rooms.php', 'POST', data),
    update: (id, data) => apiRequest('rooms.php', 'PUT', data, { id }),
    delete: (id) => apiRequest('rooms.php', 'DELETE', null, { id })
};

// ====== TRANSACTIONS API ======
const TransactionsAPI = {
    getAll: (limit = 50) => apiRequest('transactions.php', 'GET', null, { limit }),
    getRecent: (limit = 20) => apiRequest('transactions.php', 'GET', null, { action: 'recent', limit }),
    getDeposits: (limit = 50) => apiRequest('transactions.php', 'GET', null, { action: 'deposits', limit }),
    getPayments: (limit = 50) => apiRequest('transactions.php', 'GET', null, { action: 'payments', limit }),
    getToday: () => apiRequest('transactions.php', 'GET', null, { action: 'today' })
};

// ====== DASHBOARD API ======
const DashboardAPI = {
    getStats: () => apiRequest('dashboard.php', 'GET', null, { action: 'stats' }),
    getRecentActivity: () => apiRequest('dashboard.php', 'GET', null, { action: 'recent_activity' }),
    getCardTypes: () => apiRequest('dashboard.php', 'GET', null, { action: 'card_types' })
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StudentsAPI, WalletAPI, NfcCardsAPI, RoomsAPI, TransactionsAPI, DashboardAPI };
}

console.log('CVSU Key API loaded. Available: StudentsAPI, WalletAPI, NfcCardsAPI, RoomsAPI, TransactionsAPI, DashboardAPI');
