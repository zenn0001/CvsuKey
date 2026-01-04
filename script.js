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
    async handleAddFunds() {
        const studentIdInput = document.querySelector('.form-input[placeholder="Enter Student ID"]');
        const amountInput = document.querySelector('.form-input[placeholder="Enter Amount"]');
        const selectedMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'cash';
        
        if (!studentIdInput?.value || !amountInput?.value) {
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
        
        try {
            // Search for student by exact student number
            const searchResponse = await StudentsAPI.search(studentIdInput.value.trim());
            const students = searchResponse.data || [];
            
            // Find exact match on student_number
            const student = students.find(s => s.student_number === studentIdInput.value.trim());
            
            if (!student) {
                this.showNotification('Student not found. Please enter a valid Student ID.', 'error');
                return;
            }

            const referenceInput = document.querySelector('#reference-section .form-input');
            const response = await WalletAPI.deposit({
                student_number: student.student_number,
                amount: parseFloat(amountInput.value),
                payment_method: selectedMethod === 'gcash' ? 'GCash' : 'Cash',
                reference_number: referenceInput?.value || null
            });

            if (response.success === false) {
                this.showNotification(response.message || 'Failed to add funds', 'error');
                return;
            }

            this.showNotification(`Successfully added ₱${parseFloat(amountInput.value).toFixed(2)} to ${student.first_name} ${student.last_name}'s wallet!`, 'success');
            this.clearFundingForm();
            
            // Reload statistics if WalletAPI has the method
            if (typeof WalletAPI.loadStatistics === 'function') {
                WalletAPI.loadStatistics();
            }
            if (typeof WalletAPI.loadRecentFunding === 'function') {
                WalletAPI.loadRecentFunding();
            }
        } catch (error) {
            console.error('Failed to add funds:', error);
            this.showNotification('Failed to add funds: ' + error.message, 'error');
        }
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
    
    // Initialize API modules
    initializeApiModules();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});

// =====================================================
// CVSU KEY API INTEGRATION
// =====================================================

// API URL - Use full localhost URL for Live Server compatibility
const API_BASE_URL = 'http://localhost/CvsuKey/server/endpoints';

/**
 * API Client for backend communication
 */
class CvsuKeyAPI {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    async request(endpoint, method = 'GET', data = null, params = {}) {
        const url = new URL(`${this.baseUrl}/${endpoint}`);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });

        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'API request failed');
            }
            return result;
        } catch (error) {
            console.error('API Error:', error);
            // Don't show notification here - let the caller handle it
            throw error;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `api-notification api-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

const api = new CvsuKeyAPI();

/**
 * Dashboard API Module
 */
const DashboardAPI = {
    async loadStats() {
        try {
            const response = await api.request('dashboard.php', 'GET', null, { action: 'stats' });
            const stats = response.data;
            
            // Update stat cards
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length >= 4) {
                // Active Student IDs (total active cards)
                const activeIds = statCards[0]?.querySelector('h3');
                if (activeIds) activeIds.textContent = (stats.active_cards || 0).toLocaleString();
                
                // Gate Access Taps Today
                const gateTaps = statCards[1]?.querySelector('h3');
                if (gateTaps) gateTaps.textContent = (stats.today_transactions || 0).toLocaleString();
                
                // Transactions amount today
                const txnAmount = statCards[2]?.querySelector('h3');
                if (txnAmount) txnAmount.textContent = (stats.today_transactions || 0).toLocaleString();
                
                // Room status
                const roomStats = statCards[3];
                if (roomStats) {
                    const total = roomStats.querySelector('.stat-change');
                    if (total) total.textContent = `Total: ${stats.total_rooms || 0}`;
                }
            }
            
            // Load recent activity
            await this.loadRecentActivity();
            
            return stats;
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
        }
    },

    async loadRecentActivity() {
        try {
            const response = await api.request('dashboard.php', 'GET', null, { action: 'recent_activity' });
            const activities = response.data || [];
            
            const activityList = document.querySelector('.transaction-list');
            if (!activityList || activities.length === 0) return;
            
            activityList.innerHTML = activities.map(activity => `
                <div class="transaction-item">
                    <div class="transaction-icon ${activity.action === 'Deposit' ? 'success' : 'info'}">
                        <i class="fas fa-${activity.action === 'Deposit' ? 'plus-circle' : 'minus-circle'}"></i>
                    </div>
                    <div class="transaction-details">
                        <p class="transaction-title">${activity.action}</p>
                        <p class="transaction-student">${activity.name}</p>
                        <p class="transaction-time">₱${parseFloat(activity.amount).toLocaleString()}</p>
                    </div>
                    <div class="transaction-status ${activity.action === 'Deposit' ? 'granted' : 'pending'}">${activity.action}</div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load recent activity:', error);
        }
    }
};

/**
 * Students API Module
 */
const StudentsAPI = {
    async getAll() {
        return api.request('students.php');
    },

    async getById(id) {
        return api.request('students.php', 'GET', null, { id });
    },

    async search(query) {
        return api.request('students.php', 'GET', null, { action: 'search', q: query });
    },

    async create(studentData) {
        return api.request('students.php', 'POST', studentData);
    },

    async update(id, studentData) {
        return api.request('students.php', 'PUT', studentData, { id });
    },

    async delete(id) {
        return api.request('students.php', 'DELETE', null, { id });
    },

    async loadAndRenderTable() {
        try {
            const response = await this.getAll();
            const students = response.data || [];
            
            // Update stats
            const statCards = document.querySelectorAll('.student-stat-card');
            if (statCards.length >= 1) {
                const totalEl = statCards[0]?.querySelector('h3');
                if (totalEl) totalEl.textContent = students.length.toLocaleString();
            }
            
            const tbody = document.querySelector('.students-table tbody');
            if (!tbody || students.length === 0) return;

            tbody.innerHTML = students.map(student => `
                <tr data-id="${student.student_number}">
                    <td>
                        <div class="student-info">
                            <img src="${student.profile_photo || '../assets/student avatar.jpg'}" alt="Student" class="student-avatar">
                            <span>${student.first_name} ${student.middle_name || ''} ${student.last_name}</span>
                        </div>
                    </td>
                    <td>${student.student_number}</td>
                    <td>${student.course || '-'} ${student.section || ''}</td>
                    <td class="balance positive">₱${parseFloat(student.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td class="recent-activity">${student.card_status || '-'}</td>
                    <td><span class="status-badge ${(student.status || 'active').toLowerCase()}">${student.status || 'Active'}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action view" onclick="StudentsAPI.viewStudent('${student.student_number}')"><i class="fas fa-eye"></i></button>
                            <button class="btn-action edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-action delete" onclick="StudentsAPI.deleteStudent('${student.student_number}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Failed to load students:', error);
        }
    },

    // Pagination state
    currentPage: 1,
    studentsPerPage: 10,
    allStudents: [],

    async viewStudent(id) {
        try {
            const response = await this.getById(id);
            const student = response.data;
            
            const modal = document.getElementById('view-student-modal');
            if (!modal) {
                // Fallback to alert if modal doesn't exist
                alert(`Student Details:\n\nName: ${student.first_name} ${student.last_name}\nID: ${student.student_number}\nCourse: ${student.course || '-'}\nSection: ${student.section || '-'}\nNFC UID: ${student.nfc_uid || 'Not assigned'}\nCard Type: ${student.card_type || '-'}\nBalance: ₱${parseFloat(student.balance || 0).toFixed(2)}`);
                return;
            }
            
            // Populate modal fields
            document.getElementById('view-student-avatar').src = student.profile_photo || '../assets/student avatar.jpg';
            document.getElementById('view-student-name').textContent = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`;
            document.getElementById('view-student-course').textContent = `${student.course || '-'} ${student.section || ''}`;
            document.getElementById('view-student-number').textContent = student.student_number;
            document.getElementById('view-student-email').textContent = student.email || 'Not provided';
            document.getElementById('view-student-phone').textContent = student.phone_number || student.phone || 'Not provided';
            document.getElementById('view-student-gender').textContent = student.gender || '-';
            document.getElementById('view-student-year').textContent = student.year_level ? `Year ${student.year_level}` : '-';
            document.getElementById('view-student-section').textContent = student.section || '-';
            
            // NFC Card Info
            document.getElementById('view-nfc-uid').textContent = student.nfc_uid || 'No card assigned';
            document.getElementById('view-card-type').textContent = student.card_type || '-';
            document.getElementById('view-card-status').textContent = student.card_status || '-';
            document.getElementById('view-wallet-balance').textContent = `₱${parseFloat(student.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
            document.getElementById('view-room-access').textContent = student.has_room_access ? 'Enabled' : 'Disabled';
            document.getElementById('view-payment-access').textContent = student.has_payment_access ? 'Enabled' : 'Disabled';
            
            modal.classList.add('active');
        } catch (error) {
            console.error('Failed to view student:', error);
            api.showNotification('Failed to load student details', 'error');
        }
    },

    initViewModal() {
        const modal = document.getElementById('view-student-modal');
        const closeBtn = document.getElementById('close-view-modal');
        const closeBtnFooter = document.getElementById('close-view-modal-btn');
        
        if (!modal) return;
        
        const closeModal = () => modal.classList.remove('active');
        
        closeBtn?.addEventListener('click', closeModal);
        closeBtnFooter?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    },

    initViewMore() {
        const viewMoreBtn = document.querySelector('.students-table + .table-footer .btn-view-more, .data-table .btn-view-more');
        if (!viewMoreBtn) return;
        
        viewMoreBtn.addEventListener('click', async () => {
            viewMoreBtn.classList.add('loading');
            viewMoreBtn.innerHTML = '<i class="fas fa-spinner"></i> Loading...';
            
            try {
                this.currentPage++;
                await this.loadMoreStudents();
            } finally {
                viewMoreBtn.classList.remove('loading');
                viewMoreBtn.innerHTML = '<i class="fas fa-chevron-right"></i> View More';
            }
        });
    },

    async loadMoreStudents() {
        try {
            const response = await this.getAll();
            const allStudents = response.data || [];
            const startIndex = (this.currentPage - 1) * this.studentsPerPage;
            const endIndex = startIndex + this.studentsPerPage;
            const newStudents = allStudents.slice(startIndex, endIndex);
            
            if (newStudents.length === 0) {
                api.showNotification('No more students to load', 'info');
                this.currentPage--;
                return;
            }
            
            const tbody = document.querySelector('.students-table tbody');
            if (!tbody) return;
            
            const newRows = newStudents.map(student => `
                <tr data-id="${student.student_number}">
                    <td>
                        <div class="student-info">
                            <img src="${student.profile_photo || '../assets/student avatar.jpg'}" alt="Student" class="student-avatar">
                            <span>${student.first_name} ${student.middle_name || ''} ${student.last_name}</span>
                        </div>
                    </td>
                    <td>${student.student_number}</td>
                    <td>${student.course || '-'} ${student.section || ''}</td>
                    <td class="balance positive">₱${parseFloat(student.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td class="recent-activity">${student.card_status || '-'}</td>
                    <td><span class="status-badge ${(student.status || 'active').toLowerCase()}">${student.status || 'Active'}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action view" onclick="StudentsAPI.viewStudent('${student.student_number}')"><i class="fas fa-eye"></i></button>
                            <button class="btn-action edit"><i class="fas fa-edit"></i></button>
                            <button class="btn-action delete" onclick="StudentsAPI.deleteStudent('${student.student_number}')"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `).join('');
            
            tbody.insertAdjacentHTML('beforeend', newRows);
            api.showNotification(`Loaded ${newStudents.length} more students`, 'success');
            
            // Hide button if no more data
            if (endIndex >= allStudents.length) {
                const viewMoreBtn = document.querySelector('.data-table .btn-view-more');
                if (viewMoreBtn) viewMoreBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to load more students:', error);
        }
    },

    async deleteStudent(id) {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                await this.delete(id);
                api.showNotification('Student deleted successfully', 'success');
                this.loadAndRenderTable();
            } catch (error) {
                console.error('Failed to delete student:', error);
            }
        }
    },

    // Modal functions
    initModal() {
        const modal = document.getElementById('add-student-modal');
        const addBtn = document.getElementById('add-student-btn');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = document.getElementById('cancel-modal');
        const submitBtn = document.getElementById('submit-student');
        const hasNfcSelect = document.getElementById('has-nfc');
        const nfcUidGroup = document.getElementById('nfc-uid-group');
        const cardTypeGroup = document.getElementById('card-type-group');
        const nfcOptionsRow = document.getElementById('nfc-options-row');
        const cardTypeSelect = document.getElementById('card-type');
        const hasRoomAccess = document.getElementById('has-room-access');
        const hasPaymentAccess = document.getElementById('has-payment-access');

        if (!modal || !addBtn) return;

        // Toggle NFC fields visibility
        hasNfcSelect?.addEventListener('change', (e) => {
            const showNfc = e.target.value === 'yes';
            if (nfcUidGroup) nfcUidGroup.style.display = showNfc ? 'flex' : 'none';
            if (cardTypeGroup) cardTypeGroup.style.display = showNfc ? 'flex' : 'none';
            if (nfcOptionsRow) nfcOptionsRow.style.display = showNfc ? 'flex' : 'none';
            
            // Set default checkboxes based on card type
            if (showNfc) {
                this.updateAccessCheckboxes(cardTypeSelect?.value);
            }
        });

        // Update checkboxes when card type changes
        cardTypeSelect?.addEventListener('change', (e) => {
            this.updateAccessCheckboxes(e.target.value);
        });

        // Open modal
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.getElementById('add-student-form').reset();
            // Reset NFC fields visibility
            if (nfcUidGroup) nfcUidGroup.style.display = 'none';
            if (cardTypeGroup) cardTypeGroup.style.display = 'none';
            if (nfcOptionsRow) nfcOptionsRow.style.display = 'none';
        };

        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Submit form
        submitBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleAddStudent();
        });
    },

    // Update access checkboxes based on card type
    updateAccessCheckboxes(cardType) {
        const hasRoomAccess = document.getElementById('has-room-access');
        const hasPaymentAccess = document.getElementById('has-payment-access');
        
        if (!hasRoomAccess || !hasPaymentAccess) return;
        
        switch (cardType) {
            case 'Full Access':
                hasRoomAccess.checked = true;
                hasPaymentAccess.checked = true;
                break;
            case 'Limited Access':
                hasRoomAccess.checked = true;
                hasPaymentAccess.checked = false;
                break;
            case 'No Access':
                hasRoomAccess.checked = false;
                hasPaymentAccess.checked = false;
                break;
        }
    },

    async handleAddStudent() {
        const form = document.getElementById('add-student-form');
        const studentNumber = document.getElementById('student-number').value.trim();
        const firstName = document.getElementById('first-name').value.trim();
        const middleName = document.getElementById('middle-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const course = document.getElementById('course').value;
        const section = document.getElementById('section').value.trim();
        const yearLevel = document.getElementById('year-level').value;
        
        // NFC Card fields
        const hasNfc = document.getElementById('has-nfc').value === 'yes';
        const nfcUid = document.getElementById('nfc-uid')?.value.trim();
        const cardType = document.getElementById('card-type')?.value;
        const hasRoomAccess = document.getElementById('has-room-access')?.checked;
        const hasPaymentAccess = document.getElementById('has-payment-access')?.checked;
        const cardStatus = document.getElementById('card-status')?.value;

        // Validation
        if (!studentNumber || !firstName || !lastName) {
            api.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate NFC UID if card is assigned
        if (hasNfc && !nfcUid) {
            api.showNotification('Please enter the NFC Card UID', 'error');
            return;
        }

        try {
            const studentData = {
                student_number: studentNumber,
                first_name: firstName,
                middle_name: middleName || null,
                last_name: lastName,
                email: email || null,
                phone: phone || null,
                course: course || null,
                section: section || null,
                year_level: yearLevel || null
            };

            // Add NFC data if card is assigned
            if (hasNfc && nfcUid) {
                studentData.nfc_uid = nfcUid;
                studentData.card_type = cardType || 'Full Access';
                studentData.has_room_access = hasRoomAccess ? 1 : 0;
                studentData.has_payment_access = hasPaymentAccess ? 1 : 0;
                studentData.card_status = cardStatus || 'Active';
            }

            const response = await this.create(studentData);

            if (response.success === false) {
                api.showNotification(response.message || 'Failed to add student', 'error');
                return;
            }

            api.showNotification(`Student ${firstName} ${lastName} added successfully!`, 'success');
            
            // Close modal and reset form
            document.getElementById('add-student-modal').classList.remove('active');
            form.reset();
            
            // Reset NFC fields visibility
            const nfcUidGroup = document.getElementById('nfc-uid-group');
            const cardTypeGroup = document.getElementById('card-type-group');
            const nfcOptionsRow = document.getElementById('nfc-options-row');
            if (nfcUidGroup) nfcUidGroup.style.display = 'none';
            if (cardTypeGroup) cardTypeGroup.style.display = 'none';
            if (nfcOptionsRow) nfcOptionsRow.style.display = 'none';
            
            // Reload table
            this.loadAndRenderTable();
        } catch (error) {
            console.error('Failed to add student:', error);
            api.showNotification('Failed to add student: ' + error.message, 'error');
        }
    }
};

/**
 * Wallet API Module
 */
const WalletAPI = {
    async getAll() {
        return api.request('wallet.php');
    },

    async getStats() {
        return api.request('wallet.php', 'GET', null, { action: 'stats' });
    },

    async getBalance(studentNumber) {
        return api.request('wallet.php', 'GET', null, { action: 'balance', student_number: studentNumber });
    },

    async getTransactions(studentNumber) {
        return api.request('wallet.php', 'GET', null, { action: 'transactions', student_number: studentNumber });
    },

    async deposit(data) {
        return api.request('wallet.php', 'POST', data, { action: 'deposit' });
    },

    async loadStatistics() {
        try {
            const response = await this.getStats();
            const stats = response.data;
            
            const statCards = document.querySelectorAll('.funding-stat-card');
            if (statCards.length >= 3) {
                // Total funds
                const totalFunds = statCards[0]?.querySelector('h3');
                if (totalFunds) totalFunds.textContent = '₱' + parseFloat(stats.total_balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 });
                
                // Total deposited (show as GCash for now)
                const gcashTotal = statCards[1]?.querySelector('h3');
                if (gcashTotal) gcashTotal.textContent = '₱' + parseFloat(stats.total_deposited || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 });
                
                // Total spent (show as Cash)
                const cashTotal = statCards[2]?.querySelector('h3');
                if (cashTotal) cashTotal.textContent = '₱' + parseFloat(stats.total_spent || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 });
            }
        } catch (error) {
            console.error('Failed to load wallet statistics:', error);
        }
    },

    async loadRecentFunding() {
        try {
            const response = await api.request('transactions.php', 'GET', null, { action: 'deposits', limit: 10 });
            const transactions = response.data || [];
            
            const tbody = document.querySelector('.funding-history-table tbody');
            if (!tbody || transactions.length === 0) return;
            
            tbody.innerHTML = transactions.map(txn => `
                <tr>
                    <td>${new Date(txn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                    <td>
                        <div class="student-info">
                            <img src="../assets/student avatar.jpg" alt="Student">
                            <div>
                                <span class="student-name">${txn.first_name} ${txn.last_name}</span>
                                <span class="student-id">${txn.student_number}</span>
                            </div>
                        </div>
                    </td>
                    <td class="amount-funded">₱${parseFloat(txn.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td><span class="payment-method ${(txn.payment_method || 'cash').toLowerCase()}"><i class="fas fa-${txn.payment_method === 'GCash' ? 'mobile-alt' : 'money-bill-alt'}"></i> ${txn.payment_method || 'Cash'}</span></td>
                    <td>${txn.reference_number || '-'}</td>
                    <td><span class="funding-status completed">Completed</span></td>
                    <td><button class="btn-funding-action view"><i class="fas fa-eye"></i></button></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Failed to load recent funding:', error);
        }
    },

    async loadCardBalanceOverview() {
        try {
            // Get all students with their NFC cards and wallets
            const response = await StudentsAPI.getAll();
            const students = response.data || [];
            
            const tbody = document.querySelector('.cards-table tbody');
            if (!tbody) return;
            
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No students found</td></tr>';
                return;
            }

            tbody.innerHTML = students.map(student => {
                const lastUsed = student.last_transaction_at 
                    ? this.formatTimeAgo(new Date(student.last_transaction_at))
                    : 'Never';
                const issueDate = student.created_at 
                    ? new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '-';
                const cardStatus = (student.card_status || 'active').toLowerCase();
                
                return `
                <tr data-student="${student.student_number}">
                    <td>
                        <div class="card-id-info">
                            <i class="fas fa-id-card card-icon"></i>
                            <span>${student.nfc_uid || 'No Card'}</span>
                        </div>
                    </td>
                    <td>
                        <div class="student-info">
                            <img src="${student.profile_photo || '../assets/student avatar.jpg'}" alt="Student" class="student-avatar">
                            <div>
                                <span class="student-name">${student.first_name} ${student.last_name}</span>
                                <span class="student-course">${student.course || ''} ${student.section || ''}</span>
                            </div>
                        </div>
                    </td>
                    <td>${issueDate}</td>
                    <td class="balance positive">₱${parseFloat(student.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td>${lastUsed}</td>
                    <td><span class="card-status ${cardStatus}">${student.card_status || 'Active'}</span></td>
                    <td>
                        <div class="card-actions">
                            <button class="btn-card-action view" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-card-action block" title="Block Card">
                                <i class="fas fa-ban"></i>
                            </button>
                            <button class="btn-card-action reload" title="Reload Balance">
                                <i class="fas fa-plus-circle"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join('');
        } catch (error) {
            console.error('Failed to load card balance overview:', error);
        }
    },

    formatTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    async addFunds() {
        const studentIdInput = document.querySelector('.fund-form input[placeholder="Enter Student ID"]');
        const amountInput = document.querySelector('.fund-form input[placeholder="Enter Amount"]');
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'cash';
        const referenceInput = document.querySelector('#reference-section input');

        if (!studentIdInput?.value || !amountInput?.value) {
            api.showNotification('Please fill in Student ID and Amount', 'error');
            return;
        }

        try {
            // Search for student by exact student number
            const searchResponse = await StudentsAPI.search(studentIdInput.value.trim());
            const students = searchResponse.data || [];
            
            // Find exact match on student_number
            const student = students.find(s => s.student_number === studentIdInput.value.trim());
            
            if (!student) {
                api.showNotification('Student not found. Please enter a valid Student ID.', 'error');
                return;
            }

            const response = await this.deposit({
                student_number: student.student_number,
                amount: parseFloat(amountInput.value),
                payment_method: paymentMethod === 'gcash' ? 'GCash' : 'Cash',
                reference_number: referenceInput?.value || null
            });

            if (response.success === false) {
                api.showNotification(response.message || 'Failed to add funds', 'error');
                return;
            }

            api.showNotification(`Added ₱${parseFloat(amountInput.value).toFixed(2)} to ${student.first_name} ${student.last_name}'s wallet!`, 'success');
            
            // Clear form
            studentIdInput.value = '';
            amountInput.value = '';
            if (referenceInput) referenceInput.value = '';
            
            // Reload data
            this.loadStatistics();
            this.loadRecentFunding();
        } catch (error) {
            console.error('Failed to add funds:', error);
            api.showNotification('Failed to add funds: ' + error.message, 'error');
        }
    },

    // Pagination state for funding
    fundingPage: 1,
    fundingPerPage: 10,
    allTransactions: [],

    // View transaction details
    viewTransaction(txnData) {
        const modal = document.getElementById('view-transaction-modal');
        if (!modal) return;
        
        document.getElementById('view-txn-amount').textContent = `₱${parseFloat(txnData.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
        document.getElementById('view-txn-id').textContent = txnData.transaction_id || txnData.id || '-';
        document.getElementById('view-txn-date').textContent = new Date(txnData.created_at).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true 
        });
        document.getElementById('view-txn-student').textContent = `${txnData.first_name || ''} ${txnData.last_name || ''}`;
        document.getElementById('view-txn-student-number').textContent = txnData.student_number || '-';
        document.getElementById('view-txn-method').textContent = txnData.payment_method || 'Cash';
        document.getElementById('view-txn-reference').textContent = txnData.reference_number || 'N/A';
        document.getElementById('view-txn-type').textContent = txnData.transaction_type || 'Deposit';
        document.getElementById('view-txn-description').textContent = txnData.description || 'Wallet funding';
        
        modal.classList.add('active');
    },

    // View card details
    viewCard(studentData) {
        const modal = document.getElementById('view-card-modal');
        if (!modal) return;
        
        const fullName = `${studentData.first_name || ''} ${studentData.last_name || ''}`;
        
        // Card visual
        document.getElementById('view-card-uid-display').textContent = studentData.nfc_uid || 'NO CARD';
        document.getElementById('view-card-holder').textContent = fullName.toUpperCase();
        document.getElementById('view-card-type-badge').textContent = studentData.card_type || 'Standard';
        
        // Details
        document.getElementById('view-card-uid').textContent = studentData.nfc_uid || 'No card assigned';
        document.getElementById('view-card-student').textContent = fullName;
        document.getElementById('view-card-student-number').textContent = studentData.student_number || '-';
        document.getElementById('view-card-balance').textContent = `₱${parseFloat(studentData.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
        document.getElementById('view-card-type').textContent = studentData.card_type || '-';
        document.getElementById('view-card-status').textContent = studentData.card_status || 'Active';
        document.getElementById('view-card-room-access').textContent = studentData.has_room_access ? 'Enabled' : 'Disabled';
        document.getElementById('view-card-payment-access').textContent = studentData.has_payment_access ? 'Enabled' : 'Disabled';
        document.getElementById('view-card-issued').textContent = studentData.issued_date 
            ? new Date(studentData.issued_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : studentData.created_at 
                ? new Date(studentData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '-';
        document.getElementById('view-card-last-used').textContent = studentData.last_used_at 
            ? this.formatTimeAgo(new Date(studentData.last_used_at))
            : 'Never';
        
        modal.classList.add('active');
    },

    initFundingModals() {
        // Transaction modal
        const txnModal = document.getElementById('view-transaction-modal');
        const closeTxnBtn = document.getElementById('close-txn-modal');
        const closeTxnBtnFooter = document.getElementById('close-txn-modal-btn');
        
        if (txnModal) {
            const closeTxnModal = () => txnModal.classList.remove('active');
            closeTxnBtn?.addEventListener('click', closeTxnModal);
            closeTxnBtnFooter?.addEventListener('click', closeTxnModal);
            txnModal.addEventListener('click', (e) => {
                if (e.target === txnModal) closeTxnModal();
            });
        }
        
        // Card modal
        const cardModal = document.getElementById('view-card-modal');
        const closeCardBtn = document.getElementById('close-card-modal');
        const closeCardBtnFooter = document.getElementById('close-card-modal-btn');
        
        if (cardModal) {
            const closeCardModal = () => cardModal.classList.remove('active');
            closeCardBtn?.addEventListener('click', closeCardModal);
            closeCardBtnFooter?.addEventListener('click', closeCardModal);
            cardModal.addEventListener('click', (e) => {
                if (e.target === cardModal) closeCardModal();
            });
        }
        
        // Add click handlers for view buttons in tables
        document.addEventListener('click', (e) => {
            // Transaction view button
            if (e.target.closest('.btn-funding-action.view')) {
                const row = e.target.closest('tr');
                if (row) {
                    const txnData = this.getTransactionDataFromRow(row);
                    this.viewTransaction(txnData);
                }
            }
            
            // Card view button
            if (e.target.closest('.btn-card-action.view')) {
                const row = e.target.closest('tr');
                if (row) {
                    const studentNumber = row.dataset.student;
                    if (studentNumber) {
                        StudentsAPI.getById(studentNumber).then(response => {
                            this.viewCard(response.data);
                        });
                    }
                }
            }
        });
    },

    getTransactionDataFromRow(row) {
        const cells = row.querySelectorAll('td');
        return {
            created_at: cells[0]?.textContent || '',
            first_name: cells[1]?.querySelector('.student-name')?.textContent?.split(' ')[0] || '',
            last_name: cells[1]?.querySelector('.student-name')?.textContent?.split(' ').slice(1).join(' ') || '',
            student_number: cells[1]?.querySelector('.student-id')?.textContent || '',
            amount: cells[2]?.textContent?.replace(/[₱,]/g, '') || '0',
            payment_method: cells[3]?.textContent?.trim() || 'Cash',
            reference_number: cells[4]?.textContent || '-',
            transaction_type: 'Deposit'
        };
    },

    initViewMoreFunding() {
        const viewMoreBtn = document.getElementById('btn-view-more-cards');
        if (!viewMoreBtn) return;
        
        viewMoreBtn.addEventListener('click', async () => {
            viewMoreBtn.classList.add('loading');
            viewMoreBtn.innerHTML = '<i class="fas fa-spinner"></i> Loading...';
            
            try {
                // Load more card/student records
                const response = await StudentsAPI.getAll();
                const allStudents = response.data || [];
                
                this.fundingPage++;
                const startIndex = (this.fundingPage - 1) * this.fundingPerPage;
                const endIndex = startIndex + this.fundingPerPage;
                const newStudents = allStudents.slice(startIndex, endIndex);
                
                if (newStudents.length === 0) {
                    api.showNotification('No more records to load', 'info');
                    this.fundingPage--;
                    return;
                }
                
                const tbody = document.querySelector('.cards-table tbody');
                if (!tbody) return;
                
                const newRows = newStudents.map(student => {
                    const lastUsed = student.last_transaction_at 
                        ? this.formatTimeAgo(new Date(student.last_transaction_at))
                        : 'Never';
                    const issueDate = student.created_at 
                        ? new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '-';
                    const cardStatus = (student.card_status || 'active').toLowerCase();
                    
                    return `
                    <tr data-student="${student.student_number}">
                        <td>
                            <div class="card-id-info">
                                <i class="fas fa-id-card card-icon"></i>
                                <span>${student.nfc_uid || 'No Card'}</span>
                            </div>
                        </td>
                        <td>
                            <div class="student-info">
                                <img src="${student.profile_photo || '../assets/student avatar.jpg'}" alt="Student" class="student-avatar">
                                <div>
                                    <span class="student-name">${student.first_name} ${student.last_name}</span>
                                    <span class="student-course">${student.course || ''} ${student.section || ''}</span>
                                </div>
                            </div>
                        </td>
                        <td>${issueDate}</td>
                        <td class="balance positive">₱${parseFloat(student.balance || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                        <td>${lastUsed}</td>
                        <td><span class="card-status ${cardStatus}">${student.card_status || 'Active'}</span></td>
                        <td>
                            <div class="card-actions">
                                <button class="btn-card-action view" title="View Details">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-card-action block" title="Block Card">
                                    <i class="fas fa-ban"></i>
                                </button>
                                <button class="btn-card-action reload" title="Reload Balance">
                                    <i class="fas fa-plus-circle"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    `;
                }).join('');
                
                tbody.insertAdjacentHTML('beforeend', newRows);
                api.showNotification(`Loaded ${newStudents.length} more records`, 'success');
                
                // Hide button if no more data
                if (endIndex >= allStudents.length) {
                    viewMoreBtn.style.display = 'none';
                }
            } finally {
                viewMoreBtn.classList.remove('loading');
                viewMoreBtn.innerHTML = '<i class="fas fa-chevron-down"></i> View More';
            }
        });
    }
};

/**
 * NFC Cards API Module
 */
const NfcCardsAPI = {
    async getAll() {
        return api.request('nfc_cards.php');
    },

    async getByUid(uid) {
        return api.request('nfc_cards.php', 'GET', null, { uid });
    },

    async create(cardData) {
        return api.request('nfc_cards.php', 'POST', cardData);
    },

    async update(id, cardData) {
        return api.request('nfc_cards.php', 'PUT', cardData, { id });
    },

    async processAccess(nfcUid, roomId) {
        return api.request('nfc_cards.php', 'POST', { nfc_uid: nfcUid, room_id: roomId }, { action: 'access' });
    },

    // Simulate NFC tap for testing
    async simulateTap(nfcUid, roomId) {
        try {
            const response = await this.processAccess(nfcUid, roomId);
            api.showNotification(response.message, response.success ? 'success' : 'error');
            return response;
        } catch (error) {
            console.error('NFC tap failed:', error);
            return null;
        }
    }
};

/**
 * Rooms API Module
 */
const RoomsAPI = {
    async getAll() {
        return api.request('rooms.php');
    },

    async getById(id) {
        return api.request('rooms.php', 'GET', null, { id });
    },

    async getLogs(roomId) {
        return api.request('rooms.php', 'GET', null, { id: roomId, action: 'logs' });
    },

    async create(roomData) {
        return api.request('rooms.php', 'POST', roomData);
    },

    async update(id, roomData) {
        return api.request('rooms.php', 'PUT', roomData, { id });
    },

    async delete(id) {
        return api.request('rooms.php', 'DELETE', null, { id });
    },

    async loadAndRenderCards() {
        try {
            const response = await this.getAll();
            const rooms = response.data || [];
            
            // Update stats
            const statCards = document.querySelectorAll('.room-stat-card');
            const available = rooms.filter(r => r.status === 'Available').length;
            const occupied = rooms.filter(r => r.status === 'Occupied').length;
            
            if (statCards.length >= 3) {
                const occupiedEl = statCards[0]?.querySelector('h3');
                if (occupiedEl) occupiedEl.textContent = occupied;
                
                const availableEl = statCards[1]?.querySelector('h3');
                if (availableEl) availableEl.textContent = available;
                
                const totalEl = statCards[2]?.querySelector('h3');
                if (totalEl) totalEl.textContent = rooms.length;
            }
            
            // Render room cards
            const grid = document.querySelector('.device-grid');
            if (!grid || rooms.length === 0) return;
            
            grid.innerHTML = rooms.map(room => `
                <div class="device-card ${room.status.toLowerCase()}">
                    <div class="device-header">
                        <h3>${room.room_code}</h3>
                        <span class="device-status ${room.status.toLowerCase()}">${room.status}</span>
                    </div>
                    <div class="device-details">
                        <p><i class="fas fa-building"></i> ${room.building || 'Main Building'}</p>
                        <p><i class="fas fa-users"></i> Capacity: ${room.capacity}</p>
                        <p><i class="fas fa-door-open"></i> ${room.room_type}</p>
                        <p><i class="fas fa-info-circle"></i> ${room.room_name}</p>
                    </div>
                    <div class="device-actions">
                        <button class="btn-device view" onclick="RoomsAPI.viewRoom(${room.room_id})">View Details</button>
                        <button class="btn-device manage">Manage Room</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load rooms:', error);
        }
    },

    async viewRoom(id) {
        try {
            const response = await this.getById(id);
            const room = response.data;
            
            const modal = document.getElementById('view-room-modal');
            if (!modal) {
                alert(`Room Details:\n\nCode: ${room.room_code}\nName: ${room.room_name}\nType: ${room.room_type}\nBuilding: ${room.building}\nCapacity: ${room.capacity}\nStatus: ${room.status}`);
                return;
            }
            
            // Populate modal
            document.getElementById('view-room-code').textContent = room.room_code;
            document.getElementById('view-room-name').textContent = room.room_name;
            document.getElementById('view-room-type').textContent = room.room_type || '-';
            document.getElementById('view-room-building').textContent = room.building || 'Main Building';
            document.getElementById('view-room-capacity').textContent = room.capacity || '-';
            
            const statusEl = document.getElementById('view-room-status');
            statusEl.textContent = room.status;
            statusEl.className = `device-status ${room.status.toLowerCase()}`;
            
            // Load access logs
            try {
                const logsResponse = await this.getLogs(id);
                const logs = logsResponse.data || [];
                const logsContainer = document.getElementById('room-access-logs');
                
                if (logs.length === 0) {
                    logsContainer.innerHTML = '<p class="no-logs">No recent access logs</p>';
                } else {
                    logsContainer.innerHTML = logs.slice(0, 10).map(log => `
                        <div class="access-log-item">
                            <span class="log-student">${log.first_name} ${log.last_name}</span>
                            <span class="log-time">${new Date(log.access_time).toLocaleString()}</span>
                        </div>
                    `).join('');
                }
            } catch (e) {
                console.error('Failed to load access logs:', e);
            }
            
            modal.classList.add('active');
        } catch (error) {
            console.error('Failed to view room:', error);
            api.showNotification('Failed to load room details', 'error');
        }
    },

    initModal() {
        const modal = document.getElementById('add-room-modal');
        const addBtn = document.getElementById('add-room-btn');
        const closeBtn = document.getElementById('close-room-modal');
        const cancelBtn = document.getElementById('cancel-room-modal');
        const submitBtn = document.getElementById('submit-room');

        if (!modal || !addBtn) return;

        // Open modal
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.getElementById('add-room-form').reset();
        };

        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Submit form
        submitBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleAddRoom();
        });
    },

    initViewModal() {
        const modal = document.getElementById('view-room-modal');
        const closeBtn = document.getElementById('close-view-room-modal');
        const closeBtnFooter = document.getElementById('close-view-room-btn');
        
        if (!modal) return;
        
        const closeModal = () => modal.classList.remove('active');
        
        closeBtn?.addEventListener('click', closeModal);
        closeBtnFooter?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    },

    async handleAddRoom() {
        const roomCode = document.getElementById('room-code').value.trim();
        const roomName = document.getElementById('room-name').value.trim();
        const roomType = document.getElementById('room-type').value;
        const building = document.getElementById('room-building').value;
        const capacity = document.getElementById('room-capacity').value;
        const status = document.getElementById('room-status').value;
        const description = document.getElementById('room-description')?.value.trim();

        // Validation
        if (!roomCode || !roomName) {
            api.showNotification('Please fill in Room Code and Room Name', 'error');
            return;
        }

        try {
            const roomData = {
                room_code: roomCode,
                room_name: roomName,
                room_type: roomType,
                building: building,
                capacity: parseInt(capacity) || 50,
                status: status,
                description: description || null
            };

            const response = await this.create(roomData);

            if (response.success === false) {
                api.showNotification(response.message || 'Failed to add room', 'error');
                return;
            }

            api.showNotification(`Room ${roomCode} added successfully!`, 'success');
            
            // Close modal and reset form
            document.getElementById('add-room-modal').classList.remove('active');
            document.getElementById('add-room-form').reset();
            
            // Reload room cards
            this.loadAndRenderCards();
        } catch (error) {
            console.error('Failed to add room:', error);
            api.showNotification('Failed to add room: ' + error.message, 'error');
        }
    },

    async deleteRoom(id) {
        if (confirm('Are you sure you want to delete this room?')) {
            try {
                await this.delete(id);
                api.showNotification('Room deleted successfully', 'success');
                this.loadAndRenderCards();
            } catch (error) {
                console.error('Failed to delete room:', error);
                api.showNotification('Failed to delete room', 'error');
            }
        }
    }
};

/**
 * Registrar API Module - Payment Records
 */
const RegistrarAPI = {
    // State
    currentFilter: 'all',
    startDate: null,
    endDate: null,
    allPayments: [],

    // Payment type mappings
    paymentTypes: {
        'all': 'All Transactions',
        'tuition': 'Tuition Fee',
        'membership': 'Course Membership',
        'tor': 'TOR',
        'diploma': 'Diploma',
        'certification': 'Certification',
        'yearbook': 'Yearbook'
    },

    init() {
        this.initFilterTabs();
        this.initDateFilter();
        this.initSearch();
        this.initManualEntryModal();
        this.initReceiptModal();
        this.loadPayments();
    },

    initFilterTabs() {
        const tabs = document.querySelectorAll('#payment-filter-tabs .filter-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                // Add active to clicked tab
                tab.classList.add('active');
                
                // Update filter
                this.currentFilter = tab.dataset.filter;
                this.applyFilters();
            });
        });
    },

    initDateFilter() {
        const startDateInput = document.getElementById('filter-start-date');
        const endDateInput = document.getElementById('filter-end-date');
        const applyBtn = document.getElementById('apply-date-filter');

        applyBtn?.addEventListener('click', () => {
            this.startDate = startDateInput?.value || null;
            this.endDate = endDateInput?.value || null;
            this.applyFilters();
            
            if (this.startDate || this.endDate) {
                api.showNotification('Date filter applied', 'success');
            }
        });
    },

    initSearch() {
        const searchInput = document.querySelector('.header .search-box input');
        
        searchInput?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.filterBySearch(searchTerm);
        });
    },

    async loadPayments() {
        try {
            // For now, use static data from the table
            // In production, this would call an API endpoint
            this.parseTableData();
        } catch (error) {
            console.error('Failed to load payments:', error);
        }
    },

    parseTableData() {
        const rows = document.querySelectorAll('.payment-table tbody tr');
        this.allPayments = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 7) {
                this.allPayments.push({
                    element: row,
                    transactionId: cells[0]?.textContent?.trim() || '',
                    studentName: cells[1]?.querySelector('.student-name')?.textContent?.trim() || '',
                    studentId: cells[1]?.querySelector('.student-id')?.textContent?.trim() || '',
                    paymentType: cells[2]?.textContent?.trim() || '',
                    amount: cells[3]?.textContent?.trim() || '',
                    date: cells[4]?.textContent?.trim() || '',
                    method: cells[5]?.textContent?.trim() || '',
                    status: cells[6]?.querySelector('.payment-status')?.textContent?.trim() || ''
                });
            }
        });
    },

    applyFilters() {
        this.allPayments.forEach(payment => {
            let show = true;

            // Filter by payment type
            if (this.currentFilter !== 'all') {
                const filterType = this.paymentTypes[this.currentFilter]?.toLowerCase() || '';
                const paymentType = payment.paymentType.toLowerCase();
                
                if (this.currentFilter === 'tor') {
                    show = paymentType.includes('tor') || paymentType.includes('transcript');
                } else if (this.currentFilter === 'membership') {
                    show = paymentType.includes('membership') || paymentType.includes('course');
                } else {
                    show = paymentType.includes(filterType);
                }
            }

            // Filter by date range
            if (show && (this.startDate || this.endDate)) {
                const paymentDate = this.parseDate(payment.date);
                
                if (paymentDate) {
                    if (this.startDate) {
                        const start = new Date(this.startDate);
                        if (paymentDate < start) show = false;
                    }
                    if (this.endDate) {
                        const end = new Date(this.endDate);
                        end.setHours(23, 59, 59, 999); // End of day
                        if (paymentDate > end) show = false;
                    }
                }
            }

            // Show/hide row
            payment.element.style.display = show ? '' : 'none';
        });

        // Update count display
        this.updateResultsCount();
    },

    filterBySearch(searchTerm) {
        if (!searchTerm) {
            // Reset to current filter state
            this.applyFilters();
            return;
        }

        this.allPayments.forEach(payment => {
            const matchesSearch = 
                payment.transactionId.toLowerCase().includes(searchTerm) ||
                payment.studentName.toLowerCase().includes(searchTerm) ||
                payment.studentId.toLowerCase().includes(searchTerm) ||
                payment.paymentType.toLowerCase().includes(searchTerm) ||
                payment.amount.toLowerCase().includes(searchTerm) ||
                payment.status.toLowerCase().includes(searchTerm);

            // Also respect current filters
            let matchesFilter = true;
            if (this.currentFilter !== 'all') {
                const filterType = this.paymentTypes[this.currentFilter]?.toLowerCase() || '';
                const paymentType = payment.paymentType.toLowerCase();
                
                if (this.currentFilter === 'tor') {
                    matchesFilter = paymentType.includes('tor') || paymentType.includes('transcript');
                } else if (this.currentFilter === 'membership') {
                    matchesFilter = paymentType.includes('membership') || paymentType.includes('course');
                } else {
                    matchesFilter = paymentType.includes(filterType);
                }
            }

            payment.element.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
        });

        this.updateResultsCount();
    },

    parseDate(dateString) {
        // Parse dates like "Dec 1, 2025" or "Dec 2, 2025"
        try {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (e) {
            console.error('Failed to parse date:', dateString);
        }
        return null;
    },

    updateResultsCount() {
        const visibleCount = this.allPayments.filter(p => p.element.style.display !== 'none').length;
        const totalCount = this.allPayments.length;
        
        // Update or create results indicator
        let resultsIndicator = document.getElementById('filter-results-count');
        if (!resultsIndicator) {
            resultsIndicator = document.createElement('div');
            resultsIndicator.id = 'filter-results-count';
            resultsIndicator.className = 'filter-results-count';
            
            const filterSection = document.querySelector('.payment-filters');
            if (filterSection) {
                filterSection.appendChild(resultsIndicator);
            }
        }
        
        if (visibleCount === totalCount) {
            resultsIndicator.textContent = `Showing all ${totalCount} transactions`;
        } else {
            resultsIndicator.textContent = `Showing ${visibleCount} of ${totalCount} transactions`;
        }
    },

    clearFilters() {
        // Reset all filters
        this.currentFilter = 'all';
        this.startDate = null;
        this.endDate = null;

        // Reset UI
        const tabs = document.querySelectorAll('#payment-filter-tabs .filter-tab');
        tabs.forEach(t => t.classList.remove('active'));
        document.querySelector('#payment-filter-tabs .filter-tab[data-filter="all"]')?.classList.add('active');

        document.getElementById('filter-start-date').value = '';
        document.getElementById('filter-end-date').value = '';

        // Show all
        this.applyFilters();
        api.showNotification('Filters cleared', 'info');
    },

    // Manual Entry Modal
    initManualEntryModal() {
        const modal = document.getElementById('manual-entry-modal');
        const addBtn = document.getElementById('manual-entry-btn');
        const closeBtn = document.getElementById('close-entry-modal');
        const cancelBtn = document.getElementById('cancel-entry-modal');
        const submitBtn = document.getElementById('submit-entry');
        const studentIdInput = document.getElementById('entry-student-id');

        if (!modal || !addBtn) return;

        // Open modal
        addBtn.addEventListener('click', () => {
            modal.classList.add('active');
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('entry-date').value = today;
        });

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.getElementById('manual-entry-form').reset();
            document.getElementById('entry-student-name').value = '';
        };

        closeBtn?.addEventListener('click', closeModal);
        cancelBtn?.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Auto-fill student name on ID input
        studentIdInput?.addEventListener('blur', async () => {
            const studentId = studentIdInput.value.trim();
            if (studentId) {
                try {
                    const response = await StudentsAPI.search(studentId);
                    const students = response.data || [];
                    const student = students.find(s => s.student_number === studentId);
                    
                    if (student) {
                        document.getElementById('entry-student-name').value = 
                            `${student.first_name} ${student.last_name}`;
                    } else {
                        document.getElementById('entry-student-name').value = 'Student not found';
                    }
                } catch (error) {
                    console.error('Failed to find student:', error);
                }
            }
        });

        // Submit form
        submitBtn?.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleManualEntry();
        });
    },

    async handleManualEntry() {
        const studentId = document.getElementById('entry-student-id').value.trim();
        const paymentType = document.getElementById('entry-payment-type').value;
        const amount = document.getElementById('entry-amount').value;
        const paymentMethod = document.getElementById('entry-payment-method').value;
        const status = document.getElementById('entry-status').value;
        const reference = document.getElementById('entry-reference').value.trim();
        const date = document.getElementById('entry-date').value;
        const notes = document.getElementById('entry-notes').value.trim();

        // Validation
        if (!studentId || !paymentType || !amount) {
            api.showNotification('Please fill in all required fields', 'error');
            return;
        }

        try {
            // Generate transaction ID
            const txnId = '#TXN-' + String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
            const studentName = document.getElementById('entry-student-name').value || 'Unknown';
            
            // Add new row to table
            const tbody = document.querySelector('.payment-table tbody');
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${txnId}</td>
                <td>
                    <div class="student-payment-info">
                        <img src="../assets/student avatar.jpg" alt="Student" class="student-payment-avatar">
                        <div>
                            <span class="student-name">${studentName}</span>
                            <span class="student-id">${studentId}</span>
                        </div>
                    </div>
                </td>
                <td>${paymentType}</td>
                <td>₱${parseFloat(amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>${date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}</td>
                <td>
                    <span class="payment-method ${paymentMethod.toLowerCase().replace(' ', '-')}">
                        <i class="fas fa-${paymentMethod === 'NFC Card' ? 'key' : paymentMethod === 'Cash' ? 'money-bill-alt' : 'mobile-alt'}"></i>
                        ${paymentMethod}
                    </span>
                </td>
                <td><span class="payment-status ${status.toLowerCase()}">${status}</span></td>
                <td>
                    <div class="payment-actions">
                        <button class="btn-payment-action view" title="View Receipt">
                            <i class="fas fa-receipt"></i>
                        </button>
                        <button class="btn-payment-action refund" title="Refund">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // Insert at the top of the table
            tbody.insertBefore(newRow, tbody.firstChild);
            
            // Close modal and reset form
            document.getElementById('manual-entry-modal').classList.remove('active');
            document.getElementById('manual-entry-form').reset();
            document.getElementById('entry-student-name').value = '';
            
            // Re-parse table data
            this.parseTableData();
            
            api.showNotification(`Payment of ₱${parseFloat(amount).toFixed(2)} recorded successfully!`, 'success');
        } catch (error) {
            console.error('Failed to add payment:', error);
            api.showNotification('Failed to add payment: ' + error.message, 'error');
        }
    },

    // View Receipt Modal
    initReceiptModal() {
        const modal = document.getElementById('view-receipt-modal');
        const closeBtn = document.getElementById('close-receipt-modal');
        const closeBtnFooter = document.getElementById('close-receipt-btn');
        const printBtn = document.getElementById('print-receipt-btn');

        if (!modal) return;

        const closeModal = () => modal.classList.remove('active');

        closeBtn?.addEventListener('click', closeModal);
        closeBtnFooter?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Print receipt
        printBtn?.addEventListener('click', () => {
            window.print();
        });

        // Add click handlers for view receipt buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-payment-action.view')) {
                const row = e.target.closest('tr');
                if (row) {
                    this.viewReceipt(row);
                }
            }
        });
    },

    viewReceipt(row) {
        const cells = row.querySelectorAll('td');
        
        const txnId = cells[0]?.textContent?.trim() || '-';
        const studentName = cells[1]?.querySelector('.student-name')?.textContent?.trim() || '-';
        const studentId = cells[1]?.querySelector('.student-id')?.textContent?.trim() || '-';
        const paymentType = cells[2]?.textContent?.trim() || '-';
        const amount = cells[3]?.textContent?.trim() || '-';
        const date = cells[4]?.textContent?.trim() || '-';
        const method = cells[5]?.textContent?.trim() || '-';
        const status = cells[6]?.querySelector('.payment-status')?.textContent?.trim() || '-';

        // Populate receipt modal
        document.getElementById('receipt-txn-id').textContent = txnId;
        document.getElementById('receipt-date').textContent = date;
        document.getElementById('receipt-student').textContent = studentName;
        document.getElementById('receipt-student-id').textContent = studentId;
        document.getElementById('receipt-type').textContent = paymentType;
        document.getElementById('receipt-method').textContent = method;
        document.getElementById('receipt-amount').textContent = amount;
        document.getElementById('receipt-status').textContent = status;

        document.getElementById('view-receipt-modal').classList.add('active');
    }
};

/**
 * Transactions API Module
 */
const TransactionsAPI = {
    async getAll(limit = 50) {
        return api.request('transactions.php', 'GET', null, { limit });
    },

    async getRecent(limit = 20) {
        return api.request('transactions.php', 'GET', null, { action: 'recent', limit });
    },

    async getDeposits(limit = 50) {
        return api.request('transactions.php', 'GET', null, { action: 'deposits', limit });
    },

    async getPayments(limit = 50) {
        return api.request('transactions.php', 'GET', null, { action: 'payments', limit });
    },

    async getToday() {
        return api.request('transactions.php', 'GET', null, { action: 'today' });
    },

    async loadAndRenderTable() {
        try {
            const response = await this.getAll(50);
            const transactions = response.data || [];
            
            const tbody = document.querySelector('.history-table tbody');
            if (!tbody || transactions.length === 0) return;

            tbody.innerHTML = transactions.map(txn => `
                <tr>
                    <td class="transaction-id">#TXN-${String(txn.transaction_id).padStart(6, '0')}</td>
                    <td>${new Date(txn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</td>
                    <td>
                        <div class="student-info">
                            <img src="../assets/student avatar.jpg" alt="Student">
                            <div>
                                <span class="student-name">${txn.first_name} ${txn.last_name}</span>
                                <span class="student-id">${txn.student_number}</span>
                            </div>
                        </div>
                    </td>
                    <td><div class="service-info"><i class="fas fa-${txn.transaction_type === 'Deposit' ? 'plus-circle' : 'shopping-cart'}"></i><span>${txn.description || txn.transaction_type}</span></div></td>
                    <td><span class="transaction-type ${txn.transaction_type.toLowerCase()}">${txn.transaction_type}</span></td>
                    <td class="amount">₱${parseFloat(txn.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                    <td><span class="transaction-status completed">Completed</span></td>
                    <td><button class="btn-transaction-action view"><i class="fas fa-eye"></i></button></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Failed to load transactions:', error);
        }
    }
};

/**
 * Initialize API modules based on current page
 */
async function initializeApiModules() {
    const path = window.location.pathname.toLowerCase();
    
    // Add API notification styles
    if (!document.getElementById('api-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'api-notification-styles';
        style.textContent = `
            .api-notification { position: fixed; top: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; background: #333; color: white; display: flex; align-items: center; gap: 10px; transform: translateX(120%); transition: transform 0.3s ease; z-index: 10000; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            .api-notification.show { transform: translateX(0); }
            .api-notification-success { background: #22c55e; }
            .api-notification-error { background: #ef4444; }
            .api-notification-info { background: #3b82f6; }
            .api-notification i { font-size: 18px; }
        `;
        document.head.appendChild(style);
    }

    try {
        if (path.includes('dashboard')) {
            console.log('Loading dashboard data...');
            await DashboardAPI.loadStats();
        } else if (path.includes('students')) {
            console.log('Loading students data...');
            await StudentsAPI.loadAndRenderTable();
            StudentsAPI.initModal();
            StudentsAPI.initViewModal();
            StudentsAPI.initViewMore();
        } else if (path.includes('wallet') || path.includes('funding')) {
            console.log('Loading wallet data...');
            await WalletAPI.loadStatistics();
            await WalletAPI.loadRecentFunding();
            await WalletAPI.loadCardBalanceOverview();
            WalletAPI.initFundingModals();
            WalletAPI.initViewMoreFunding();
            // Note: Add funds button handler is already attached by FundingPageManager
        } else if (path.includes('rooms')) {
            console.log('Loading rooms data...');
            await RoomsAPI.loadAndRenderCards();
            RoomsAPI.initModal();
            RoomsAPI.initViewModal();
        } else if (path.includes('registrar')) {
            console.log('Loading registrar data...');
            RegistrarAPI.init();
        } else if (path.includes('transactions')) {
            console.log('Loading transactions data...');
            await TransactionsAPI.loadAndRenderTable();
        }
        
        console.log('✓ CVSU Key API data synced successfully');
    } catch (error) {
        console.error('Failed to initialize API modules:', error);
    }
}

// Export API modules globally
window.api = api;
window.DashboardAPI = DashboardAPI;
window.StudentsAPI = StudentsAPI;
window.WalletAPI = WalletAPI;
window.NfcCardsAPI = NfcCardsAPI;
window.RoomsAPI = RoomsAPI;
window.RegistrarAPI = RegistrarAPI;
window.TransactionsAPI = TransactionsAPI;