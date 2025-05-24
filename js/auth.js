// Update auth.js to integrate with user management system

// Store current user in session
let currentUser = null;

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    checkLoginStatus();
    
    // Set up login form event listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Set up logout button event listener
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Update UI based on user role
    updateUIBasedOnRole();
});

// Check if user is already logged in
function checkLoginStatus() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        
        // If on login page and already logged in, redirect to dashboard
        if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
            window.location.href = 'dashboard.html';
        }
        
        // Update user info display
        updateUserInfoDisplay();
    } else {
        // If not on login page and not logged in, redirect to login page
        if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Validate input
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    try {
        // Authenticate user
        const user = window.userManager.authenticate(username, password);
        
        if (user) {
            // Store user in session
            currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            showLoginError('Invalid username or password');
        }
    } catch (error) {
        showLoginError(error.message);
    }
}

// Handle logout button click
function handleLogout() {
    // Clear session storage
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Show login error message
function showLoginError(message) {
    const errorElement = document.getElementById('login-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

// Update user info display
function updateUserInfoDisplay() {
    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement && currentUser) {
        userInfoElement.textContent = `${currentUser.fullName || currentUser.username} (${getRoleName(currentUser.role)})`;
    }
}

// Update UI based on user role
function updateUIBasedOnRole() {
    if (!currentUser) return;
    
    // Add user management tab for admin users
    const tabs = document.querySelector('.tabs');
    if (tabs && (currentUser.role === 'super_admin' || currentUser.role === 'admin')) {
        // Check if user management tab already exists
        if (!document.querySelector('[data-tab="user-management"]')) {
            const userManagementTab = document.createElement('div');
            userManagementTab.className = 'tab';
            userManagementTab.setAttribute('data-tab', 'user-management');
            userManagementTab.setAttribute('data-lang-en', 'User Management');
            userManagementTab.setAttribute('data-lang-ar', 'إدارة المستخدمين');
            userManagementTab.textContent = 'User Management';
            userManagementTab.addEventListener('click', () => {
                window.location.href = 'user-management.html';
            });
            
            tabs.appendChild(userManagementTab);
        }
    }
    
    // Hide reports not created by the user for regular users
    if (currentUser.role === 'regular_user') {
        // Filter reports to show only those created by the current user
        if (window.savedReports) {
            window.savedReports = window.savedReports.filter(report => report.createdBy === currentUser.id);
        }
        
        if (window.savedInspections) {
            window.savedInspections = window.savedInspections.filter(inspection => inspection.createdBy === currentUser.id);
        }
    }
}

// Get readable role name
function getRoleName(role) {
    switch (role) {
        case 'super_admin':
            return 'Super Admin';
        case 'admin':
            return 'Admin';
        case 'supervisor':
            return 'Supervisor';
        case 'regular_user':
            return 'Regular User';
        default:
            return role;
    }
}

// Check if current user has permission
function hasPermission(permission) {
    if (!currentUser) return false;
    
    // Get permissions for the user's role
    const rolePermissions = {
        'super_admin': [
            'create_reports', 'view_all_reports', 'view_own_reports', 
            'edit_reports', 'delete_reports', 'create_users', 
            'edit_users', 'delete_users', 'system_settings'
        ],
        'admin': [
            'create_reports', 'view_all_reports', 'view_own_reports', 
            'edit_reports', 'delete_reports', 'create_users', 
            'edit_users', 'delete_users', 'system_settings'
        ],
        'supervisor': [
            'create_reports', 'view_all_reports', 'view_own_reports'
        ],
        'regular_user': [
            'create_reports', 'view_own_reports'
        ]
    };
    
    const userPermissions = rolePermissions[currentUser.role] || [];
    return userPermissions.includes(permission);
}

// Export current user and permission functions for use in other modules
window.currentUser = currentUser;
window.hasPermission = hasPermission;
