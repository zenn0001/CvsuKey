// Admin Dashboard JavaScript
class CVSUKeyAdmin {
    constructor() {
        this.currentSection = 'dashboard';
        this.sidebarOpen = true;
        this.initializeEventListeners();
        this.initializeCharts();
        this.setupMockData();
        this.startRealTimeUpdates();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Sidebar navigation
        this.setupSidebarNavigation();
        
        // Mobile sidebar toggle
        this.setupMobileToggle();
        
        // Filter functionality
        this.setupFilters();
        
        // Search functionality
        this.setupSearch();
        
        // Modal and popup handlers
        this.setupModals();
        
        // Table interactions
        this.setupTableInteractions();
        
        // Setup room management interactions
        this.setupRoomInteractions();
        
        // Payment filter tabs
        this.setupPaymentFilters();
        
        // NFC Card management
        this.setupCardManagement();
        
        // Campus services
        this.setupServicesManagement();
        
        // Payment method selection
        this.setupPaymentMethodSelection();
    }

    // Setup sidebar navigation
    setupSidebarNavigation() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Allow normal navigation to separate HTML files
                // No need to prevent default behavior anymore
                
                // Remove active class from all items
                menuItems.forEach(mi => mi.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
            });
        });
    }

    // Show specific section
    // showSection method no longer needed - using separate HTML files now
    // showSection(sectionName) {
    //     // Hide all sections
    //     document.querySelectorAll('.content-section').forEach(section => {
    //         section.classList.remove('active');
    //     });
    //     
    //     // Show target section
    //     const targetSection = document.getElementById(`${sectionName}-section`);
    //     if (targetSection) {
    //         targetSection.classList.add('active');
    //         this.currentSection = sectionName;
    //     }
    // }

    // Setup mobile sidebar toggle
    setupMobileToggle() {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                this.sidebarOpen = !this.sidebarOpen;
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                    this.sidebarOpen = false;
                }
            }
        });
    }

    // Setup filter functionality
    setupFilters() {
        const filterSelects = document.querySelectorAll('.filter-select');
        
        filterSelects.forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Date filters
        const dateInputs = document.querySelectorAll('.date-input');
        dateInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.applyDateFilters();
            });
        });

        // Filter button
        const filterBtn = document.querySelector('.btn-filter');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                this.applyDateFilters();
                this.showNotification('Filters applied successfully', 'success');
            });
        }
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-box input');
        
        if (searchInput) {
            let searchTimeout;
            
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        }
    }

    // Setup modal handlers
    setupModals() {
        // Action buttons in tables
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-action.view') || e.target.closest('.btn-payment-action.view')) {
                this.showViewModal(e.target.closest('tr'));
            }
            
            if (e.target.closest('.btn-action.edit')) {
                this.showEditModal(e.target.closest('tr'));
            }
            
            if (e.target.closest('.btn-action.delete')) {
                this.showDeleteConfirm(e.target.closest('tr'));
            }
        });
    }

    // Setup table interactions
    setupTableInteractions() {
        // Table row hover effects and click handlers
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-action') && !e.target.closest('.btn-payment-action')) {
                    this.selectTableRow(row);
                }
            });
        });

        // Pagination
        const paginationBtns = document.querySelectorAll('.pagination-btn');
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.changePage(btn.classList.contains('next') ? 'next' : 'prev');
            });
        });
    }

    // Setup room management interactions
    setupRoomInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-room.book')) {
                this.bookRoom(e.target.closest('.room-card'));
            }
            
            if (e.target.closest('.btn-room.view')) {
                this.viewRoomSchedule(e.target.closest('.room-card'));
            }
            
            if (e.target.closest('.btn-room.update')) {
                this.updateRoomStatus(e.target.closest('.room-card'));
            }
            
            if (e.target.closest('.btn-room.details')) {
                this.showRoomDetails(e.target.closest('.room-card'));
            }
        });
    }

    // Setup payment filter tabs
    setupPaymentFilters() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.filterPayments(tab.dataset.filter);
            });
        });
    }

    // Setup payment method selection
    setupPaymentMethodSelection() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        const referenceSection = document.getElementById('reference-section');
        const verifyBtn = document.getElementById('verify-btn');
        const referenceInput = document.querySelector('#reference-section .form-input');
        
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Update radio button
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Show/hide reference section based on payment method
                const method = option.dataset.method;
                if (method === 'gcash') {
                    referenceSection.style.display = 'block';
                    verifyBtn.style.display = 'block';
                    referenceInput.placeholder = 'Enter GCash Reference Number';
                    referenceInput.previousElementSibling.textContent = 'GCash Reference Number';
                } else {
                    referenceSection.style.display = 'none';
                    verifyBtn.style.display = 'none';
                }
            });
        });

        // Handle radio button changes
        const radioButtons = document.querySelectorAll('input[name="payment-method"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                const selectedOption = document.querySelector(`[data-method="${radio.value}"]`);
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                selectedOption.classList.add('selected');
                
                if (radio.value === 'gcash') {
                    referenceSection.style.display = 'block';
                    verifyBtn.style.display = 'block';
                    referenceInput.placeholder = 'Enter GCash Reference Number';
                    referenceInput.previousElementSibling.textContent = 'GCash Reference Number';
                } else {
                    referenceSection.style.display = 'none';
                    verifyBtn.style.display = 'none';
                }
            });
        });

        // Handle verify payment button
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => {
                const referenceValue = referenceInput.value.trim();
                if (referenceValue) {
                    this.verifyGCashPayment(referenceValue);
                } else {
                    this.showNotification('Please enter a reference number', 'warning');
                }
            });
        }

        // Handle add funds button
        const addFundsBtn = document.querySelector('.btn-fund-add');
        if (addFundsBtn) {
            addFundsBtn.addEventListener('click', () => {
                this.handleAddFunds();
            });
        }
    }

    // Verify GCash payment
    verifyGCashPayment(referenceNumber) {
        this.showNotification('Verifying GCash payment...', 'info');
        
        // Simulate verification process
        setTimeout(() => {
            const isValid = Math.random() > 0.3; // 70% success rate for demo
            
            if (isValid) {
                this.showNotification('GCash payment verified successfully!', 'success');
                // Enable add funds button or auto-proceed
                document.querySelector('.btn-fund-add').textContent = 'Complete Transaction';
            } else {
                this.showNotification('Invalid reference number. Please check and try again.', 'error');
            }
        }, 2000);
    }

    // Handle add funds process
    handleAddFunds() {
        const studentId = document.querySelector('.form-input[placeholder="Enter Student ID"]').value;
        const amount = document.querySelector('.form-input[placeholder="Enter Amount"]').value;
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (!studentId || !amount) {
            this.showNotification('Please fill in all required fields', 'warning');
            return;
        }

        if (selectedMethod === 'gcash') {
            const referenceNumber = document.querySelector('#reference-section .form-input').value;
            if (!referenceNumber) {
                this.showNotification('Please enter GCash reference number', 'warning');
                return;
            }
        }

        this.showNotification('Processing fund addition...', 'info');
        
        // Simulate fund addition process
        setTimeout(() => {
            this.showNotification(`Successfully added ₱${amount} to student ${studentId}`, 'success');
            this.clearFundingForm();
        }, 1500);
    }

    // Clear funding form
    clearFundingForm() {
        document.querySelector('.form-input[placeholder="Enter Student ID"]').value = '';
        document.querySelector('.form-input[placeholder="Enter Amount"]').value = '';
        document.querySelector('#reference-section .form-input').value = '';
        document.querySelector('#cash-option').checked = true;
        document.querySelector('[data-method="cash"]').classList.add('selected');
        document.querySelector('[data-method="gcash"]').classList.remove('selected');
        document.querySelector('#reference-section').style.display = 'none';
        document.querySelector('#verify-btn').style.display = 'none';
        document.querySelector('.btn-fund-add').textContent = 'Add Funds';
    }

    // Apply filters to tables
    applyFilters() {
        const courseFilter = document.querySelector('.filter-select').value;
        // Simulate filtering logic
        console.log('Applying filters:', { course: courseFilter });
        this.showNotification('Filters applied', 'info');
    }

    // Apply date filters
    applyDateFilters() {
        const startDate = document.querySelector('.date-input:first-of-type').value;
        const endDate = document.querySelector('.date-input:last-of-type').value;
        
        if (startDate && endDate) {
            console.log('Filtering by date range:', { startDate, endDate });
        }
    }

    // Perform search
    performSearch(query) {
        if (query.length < 2) return;
        
        console.log('Searching for:', query);
        // Simulate search highlighting
        this.highlightSearchResults(query);
    }

    // Highlight search results
    highlightSearchResults(query) {
        const tableRows = document.querySelectorAll('tbody tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                row.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                row.style.borderLeft = '3px solid var(--primary-color)';
            } else {
                row.style.backgroundColor = '';
                row.style.borderLeft = '';
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // Get notification icon based on type
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Table row selection
    selectTableRow(row) {
        // Remove selection from other rows
        document.querySelectorAll('tbody tr.selected').forEach(r => r.classList.remove('selected'));
        
        // Add selection to current row
        row.classList.add('selected');
    }

    // Change page
    changePage(direction) {
        const paginationInfo = document.querySelector('.pagination-info');
        const currentText = paginationInfo.textContent;
        
        // Simulate pagination
        this.showNotification(`Loading ${direction} page...`, 'info');
        
        // Add loading state
        const table = document.querySelector('.data-table');
        table.classList.add('loading');
        
        setTimeout(() => {
            table.classList.remove('loading');
        }, 1000);
    }

    // Room management functions
    bookRoom(roomCard) {
        const roomName = roomCard.querySelector('.room-header h3').textContent;
        this.showNotification(`Booking ${roomName}...`, 'success');
        
        // Simulate booking
        setTimeout(() => {
            roomCard.querySelector('.room-status').textContent = 'Booked';
            roomCard.querySelector('.room-status').className = 'room-status occupied';
            roomCard.classList.remove('available');
            roomCard.classList.add('occupied');
        }, 1500);
    }

    viewRoomSchedule(roomCard) {
        const roomName = roomCard.querySelector('.room-header h3').textContent;
        this.showNotification(`Loading schedule for ${roomName}...`, 'info');
    }

    updateRoomStatus(roomCard) {
        const roomName = roomCard.querySelector('.room-header h3').textContent;
        this.showNotification(`Updating ${roomName} status...`, 'warning');
        
        // Simulate status update
        setTimeout(() => {
            roomCard.querySelector('.room-status').textContent = 'Available';
            roomCard.querySelector('.room-status').className = 'room-status available';
            roomCard.classList.remove('maintenance');
            roomCard.classList.add('available');
        }, 1500);
    }

    showRoomDetails(roomCard) {
        const roomName = roomCard.querySelector('.room-header h3').textContent;
        this.showNotification(`Loading details for ${roomName}...`, 'info');
    }

    // Payment filtering
    filterPayments(filterType) {
        this.showNotification(`Filtering payments by ${filterType}`, 'info');
        
        // Add loading state to payment table
        const paymentTable = document.querySelector('.payment-table-container');
        if (paymentTable) {
            paymentTable.classList.add('loading');
            setTimeout(() => {
                paymentTable.classList.remove('loading');
            }, 1000);
        }
    }

    // Modal functions
    showViewModal(row) {
        this.showNotification('Opening details view...', 'info');
    }

    showEditModal(row) {
        this.showNotification('Opening edit form...', 'info');
    }

    showDeleteConfirm(row) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.showNotification('Item deleted successfully', 'success');
            row.remove();
        }
    }

    // Initialize charts with Chart.js
    initializeCharts() {
        // Transaction Overview Chart
        this.createChart('transactionChart', {
            type: 'bar',
            data: this.generateTransactionChartData(),
            options: this.getTransactionBarChartOptions()
        });

        // Revenue Trends Chart
        this.createChart('revenueChart', {
            type: 'line',
            data: this.generateChartData('Revenue Trends', 'area'),
            options: this.getAreaChartOptions('Revenue Trends')
        });

        // Payment Methods Chart
        this.createChart('methodsChart', {
            type: 'doughnut',
            data: this.generatePieChartData(),
            options: this.getPieChartOptions()
        });

        // Room Usage Chart
        this.createChart('roomUsageChart', {
            type: 'bar',
            data: this.generateChartData('Room Usage', 'bar'),
            options: this.getBarChartOptions('Room Usage')
        });
    }

    // Create chart with Chart.js
    createChart(canvasId, config) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        try {
            // Destroy existing chart if it exists
            if (this.charts && this.charts[canvasId]) {
                this.charts[canvasId].destroy();
            }

            // Initialize charts object if not exists
            if (!this.charts) this.charts = {};

            // Create new chart
            this.charts[canvasId] = new Chart(canvas, config);
            
            console.log(`Chart created for ${canvasId}`);
        } catch (error) {
            console.log(`Chart.js not available, using placeholder for ${canvasId}`);
            
            // Fallback to placeholder
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#6366f1';
            ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Chart Placeholder', canvas.width / 2, canvas.height / 2);
        }
    }

    // Generate mock chart data
    generateChartData(title, chartType) {
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        
        let data, data2;
        if (chartType === 'line' || chartType === 'area') {
            data = Array.from({length: 7}, () => Math.floor(Math.random() * 50000) + 10000);
            data2 = Array.from({length: 7}, () => Math.floor(Math.random() * 30000) + 5000);
        } else {
            data = Array.from({length: 7}, () => Math.floor(Math.random() * 100) + 20);
        }
        
        const datasets = [];
        
        if (chartType === 'line') {
            datasets.push({
                label: 'Current Month',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.4
            });
            datasets.push({
                label: 'Previous Month',
                data: data2,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                borderDash: [5, 5]
            });
        } else if (chartType === 'area') {
            datasets.push({
                label: 'Revenue',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            });
        } else if (chartType === 'bar') {
            datasets.push({
                label: 'Usage %',
                data: data,
                backgroundColor: [
                    '#6366f1', '#10b981', '#f59e0b', '#ef4444', 
                    '#8b5cf6', '#06b6d4', '#84cc16'
                ],
                borderColor: [
                    '#4f46e5', '#059669', '#d97706', '#dc2626',
                    '#7c3aed', '#0891b2', '#65a30d'
                ],
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            });
        }
        
        return { labels, datasets };
    }

    // Generate pie chart data
    generatePieChartData() {
        return {
            labels: ['NFC Card', 'Cash', 'Online Banking', 'Bank Transfer'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#6366f1',
                    '#10b981', 
                    '#f59e0b',
                    '#ef4444'
                ],
                borderColor: [
                    '#4f46e5',
                    '#059669',
                    '#d97706', 
                    '#dc2626'
                ],
                borderWidth: 2,
                hoverOffset: 4
            }]
        };
    }

    // Get line chart options
    getLineChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: false,
                    text: title,
                    font: {
                        size: 16,
                        family: 'Inter'
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    titleFont: {
                        family: 'Inter'
                    },
                    bodyFont: {
                        family: 'Inter'
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    }
                }
            }
        };
    }

    // Get area chart options
    getAreaChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                title: {
                    display: false,
                    text: title
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return '₱' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        callback: function(value) {
                            return '₱' + (value / 1000) + 'K';
                        }
                    }
                }
            }
        };
    }

    // Get bar chart options
    getBarChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false,
                    text: title
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        };
    }

    // Get pie chart options
    getPieChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        font: {
                            family: 'Inter'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        };
    }

    // Generate transaction chart data
    generateTransactionChartData() {
        return {
            labels: ['Active Student IDs', 'Gate Access Taps', 'Library Verifications', 'Room Status'],
            datasets: [{
                label: 'Count',
                data: [3500, 1245, 287, 350], // Realistic data for smaller school (room status x10 for visibility)
                backgroundColor: [
                    'rgba(34, 197, 94, 0.85)',   // Green for student IDs
                    'rgba(59, 130, 246, 0.85)',  // Blue for gate access
                    'rgba(147, 51, 234, 0.85)',  // Purple for library
                    'rgba(249, 115, 22, 0.95)'   // More opaque orange for room status
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)', 
                    'rgb(147, 51, 234)',
                    'rgb(249, 115, 22)'
                ],
                borderWidth: 3,
                borderRadius: 10,
                borderSkipped: false
            }]
        };
    }

    // Get transaction bar chart options
    getTransactionBarChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            return label + ': ' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        maxRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            family: 'Inter'
                        },
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        };
    }

    // Setup mock data
    setupMockData() {
        this.mockData = {
            students: this.generateMockStudents(),
            payments: this.generateMockPayments(),
            rooms: this.generateMockRooms()
        };
    }

    // Generate mock students
    generateMockStudents() {
        return Array.from({length: 50}, (_, i) => ({
            id: `2021-${String(i + 1).padStart(4, '0')}`,
            name: `Student ${i + 1}`,
            course: ['BSIT', 'BSCS', 'BSCE'][Math.floor(Math.random() * 3)],
            year: Math.floor(Math.random() * 4) + 1,
            balance: Math.floor(Math.random() * 10000) + 1000,
            status: ['Active', 'Inactive'][Math.floor(Math.random() * 2)]
        }));
    }

    // Generate mock payments
    generateMockPayments() {
        return Array.from({length: 30}, (_, i) => ({
            id: `TXN-${String(i + 1).padStart(6, '0')}`,
            student: `Student ${i + 1}`,
            type: ['Tuition', 'Library', 'Laboratory', 'Misc'][Math.floor(Math.random() * 4)],
            amount: Math.floor(Math.random() * 20000) + 1000,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            status: 'Completed'
        }));
    }

    // Generate mock rooms
    generateMockRooms() {
        return Array.from({length: 20}, (_, i) => ({
            id: `Room ${String.fromCharCode(65 + Math.floor(i / 10))}${i + 1}`,
            capacity: Math.floor(Math.random() * 50) + 20,
            type: ['Computer Lab', 'Lecture Hall', 'Laboratory'][Math.floor(Math.random() * 3)],
            status: ['Available', 'Occupied', 'Maintenance'][Math.floor(Math.random() * 3)],
            building: `Building ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`,
            floor: Math.floor(Math.random() * 5) + 1
        }));
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Update current date and time immediately and every minute
        this.updateCurrentDateTime();
        setInterval(() => {
            this.updateCurrentDateTime();
        }, 60000);

        // Update stats every 30 seconds
        setInterval(() => {
            this.updateStats();
        }, 30000);

        // Update recent transactions every 10 seconds
        setInterval(() => {
            this.updateRecentTransactions();
        }, 10000);
    }

    // Update current date and time
    updateCurrentDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const formattedDateTime = now.toLocaleDateString('en-US', options);
        
        const datetimeElement = document.getElementById('current-datetime');
        if (datetimeElement) {
            datetimeElement.textContent = formattedDateTime;
        }
    }

    // Update statistics
    updateStats() {
        const statCards = document.querySelectorAll('.stat-card h3');
        statCards.forEach(stat => {
            const currentValue = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
            const change = Math.floor(Math.random() * 10) - 5; // Random change -5 to +5
            const newValue = Math.max(0, currentValue + change);
            
            if (stat.textContent.includes('₱')) {
                stat.textContent = `₱${newValue.toLocaleString()}`;
            } else {
                stat.textContent = newValue.toLocaleString();
            }
        });
    }

    // Update recent transactions
    updateRecentTransactions() {
        const transactionList = document.querySelector('.transaction-list');
        if (!transactionList) return;

        // Add a new transaction at the top occasionally
        if (Math.random() < 0.3) {
            const newTransaction = this.createTransactionElement({
                title: 'New Payment',
                student: 'Jane Smith - BSCS 2A',
                amount: Math.floor(Math.random() * 5000) + 1000,
                type: 'success'
            });
            
            transactionList.insertBefore(newTransaction, transactionList.firstChild);
            
            // Remove the last transaction to keep the list manageable
            if (transactionList.children.length > 5) {
                transactionList.removeChild(transactionList.lastChild);
            }
        }
    }

    // Create transaction element
    createTransactionElement(transaction) {
        const element = document.createElement('div');
        element.className = 'transaction-item';
        element.innerHTML = `
            <div class="transaction-icon ${transaction.type}">
                <i class="fas fa-check"></i>
            </div>
            <div class="transaction-details">
                <p class="transaction-title">${transaction.title}</p>
                <p class="transaction-student">${transaction.student}</p>
            </div>
            <div class="transaction-amount">₱${transaction.amount.toLocaleString()}</div>
        `;
        return element;
    }

    // Utility function to format currency
    formatCurrency(amount) {
        return `₱${amount.toLocaleString()}`;
    }

    // Setup NFC card management
    setupCardManagement() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-card-action.view')) {
                this.viewCardDetails(e.target.closest('tr'));
            }
            
            if (e.target.closest('.btn-card-action.block')) {
                this.blockCard(e.target.closest('tr'));
            }
            
            if (e.target.closest('.btn-card-action.reload')) {
                this.reloadCard(e.target.closest('tr'));
            }
        });
    }

    // Setup services management
    setupServicesManagement() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                this.viewServiceDetails(card);
            });
        });
    }

    // Card management functions
    viewCardDetails(row) {
        const cardId = row.querySelector('.card-id-info span').textContent;
        this.showNotification(`Loading details for card ${cardId}...`, 'info');
    }

    blockCard(row) {
        const cardId = row.querySelector('.card-id-info span').textContent;
        if (confirm(`Are you sure you want to block card ${cardId}?`)) {
            this.showNotification(`Card ${cardId} has been blocked`, 'warning');
            
            // Update UI
            const statusElement = row.querySelector('.card-status');
            statusElement.textContent = 'Blocked';
            statusElement.className = 'card-status blocked';
        }
    }

    reloadCard(row) {
        const cardId = row.querySelector('.card-id-info span').textContent;
        const amount = prompt('Enter reload amount:', '500');
        
        if (amount && !isNaN(amount)) {
            this.showNotification(`₱${amount} loaded to card ${cardId}`, 'success');
            
            // Update balance in UI
            const balanceElement = row.querySelector('.balance');
            const currentBalance = parseInt(balanceElement.textContent.replace(/[^0-9]/g, ''));
            const newBalance = currentBalance + parseInt(amount);
            balanceElement.textContent = `₱${newBalance.toLocaleString()}.00`;
        }
    }

    viewServiceDetails(card) {
        const serviceName = card.querySelector('h3').textContent;
        this.showNotification(`Loading ${serviceName} details...`, 'info');
    }

    // Utility function to format currency
    formatCurrency(amount) {
        return `₱${amount.toLocaleString()}`;
    }

    // Utility function to format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}

// Add notification styles dynamically
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    z-index: 10000;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
}

.notification-success {
    border-left: 4px solid var(--accent-color);
}

.notification-error {
    border-left: 4px solid var(--danger-color);
}

.notification-warning {
    border-left: 4px solid var(--warning-color);
}

.notification-info {
    border-left: 4px solid var(--primary-color);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-content i {
    font-size: 1.125rem;
}

.notification-success i {
    color: var(--accent-color);
}

.notification-error i {
    color: var(--danger-color);
}

.notification-warning i {
    color: var(--warning-color);
}

.notification-info i {
    color: var(--primary-color);
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
}

.notification-close:hover {
    color: var(--text-primary);
    background: var(--secondary-color);
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.selected {
    background-color: rgba(99, 102, 241, 0.1) !important;
    border-left: 3px solid var(--primary-color) !important;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);

// Initialize the admin dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cvsuAdmin = new CVSUKeyAdmin();
    console.log('CVSU Key Admin Dashboard initialized successfully!');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});