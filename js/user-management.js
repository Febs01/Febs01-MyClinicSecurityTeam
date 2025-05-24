// Updated User Management Implementation for Security Department Management System

// User roles and permissions
const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    SUPERVISOR: 'supervisor',
    REGULAR_USER: 'regular_user'
};

// Permission definitions
const PERMISSIONS = {
    CREATE_REPORTS: 'create_reports',
    VIEW_ALL_REPORTS: 'view_all_reports',
    VIEW_OWN_REPORTS: 'view_own_reports',
    EDIT_REPORTS: 'edit_reports',
    DELETE_REPORTS: 'delete_reports',
    CREATE_USERS: 'create_users',
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',
    SYSTEM_SETTINGS: 'system_settings'
};

// Role-based permission mapping
const ROLE_PERMISSIONS = {
    [USER_ROLES.SUPER_ADMIN]: [
        PERMISSIONS.CREATE_REPORTS,
        PERMISSIONS.VIEW_ALL_REPORTS,
        PERMISSIONS.VIEW_OWN_REPORTS,
        PERMISSIONS.EDIT_REPORTS,
        PERMISSIONS.DELETE_REPORTS,
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.EDIT_USERS,
        PERMISSIONS.DELETE_USERS,
        PERMISSIONS.SYSTEM_SETTINGS
    ],
    [USER_ROLES.ADMIN]: [
        PERMISSIONS.CREATE_REPORTS,
        PERMISSIONS.VIEW_ALL_REPORTS,
        PERMISSIONS.VIEW_OWN_REPORTS,
        PERMISSIONS.EDIT_REPORTS,
        PERMISSIONS.DELETE_REPORTS,
        PERMISSIONS.CREATE_USERS,
        PERMISSIONS.EDIT_USERS,
        PERMISSIONS.DELETE_USERS,
        PERMISSIONS.SYSTEM_SETTINGS
    ],
    [USER_ROLES.SUPERVISOR]: [
        PERMISSIONS.CREATE_REPORTS,
        PERMISSIONS.VIEW_ALL_REPORTS,
        PERMISSIONS.VIEW_OWN_REPORTS
    ],
    [USER_ROLES.REGULAR_USER]: [
        PERMISSIONS.CREATE_REPORTS,
        PERMISSIONS.VIEW_OWN_REPORTS
    ]
};

// User management class
class UserManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.loadCurrentUser();
        
        // Debug logging
        console.log('UserManager initialized');
        console.log('Loaded users:', this.users);
        console.log('Current user:', this.currentUser);
    }

    // Load users from localStorage
    loadUsers() {
        try {
            const usersJson = localStorage.getItem('users');
            console.log('Loading users from localStorage:', usersJson);
            
            if (usersJson) {
                return JSON.parse(usersJson);
            } else {
                // Create default admin user if no users exist
                const defaultUsers = [
                    {
                        id: this.generateId(),
                        username: 'admin',
                        passwordHash: this.hashPassword('admin123'),
                        fullName: 'Administrator',
                        role: USER_ROLES.SUPER_ADMIN,
                        email: '',
                        createdBy: 'system',
                        createdAt: new Date().toISOString(),
                        lastLogin: null,
                        active: true
                    }
                ];
                this.saveUsers(defaultUsers);
                console.log('Created default admin user:', defaultUsers);
                return defaultUsers;
            }
        } catch (error) {
            console.error('Error loading users:', error);
            // Recover by creating default admin
            const defaultUsers = [
                {
                    id: this.generateId(),
                    username: 'admin',
                    passwordHash: this.hashPassword('admin123'),
                    fullName: 'Administrator',
                    role: USER_ROLES.SUPER_ADMIN,
                    email: '',
                    createdBy: 'system',
                    createdAt: new Date().toISOString(),
                    lastLogin: null,
                    active: true
                }
            ];
            this.saveUsers(defaultUsers);
            console.log('Created default admin user after error:', defaultUsers);
            return defaultUsers;
        }
    }
    
    // Load current user from session storage
    loadCurrentUser() {
        try {
            const currentUserJson = sessionStorage.getItem('currentUser');
            if (currentUserJson) {
                const currentUser = JSON.parse(currentUserJson);
                console.log('Loaded current user from session storage:', currentUser);
                return currentUser;
            }
            return null;
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }

    // Save current user to session storage
    saveCurrentUser(user) {
        try {
            if (user) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                console.log('Saved current user to session storage:', user);
            } else {
                sessionStorage.removeItem('currentUser');
                console.log('Removed current user from session storage');
            }
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    // Save users to localStorage
    saveUsers(users) {
        try {
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Saved users to localStorage:', users);
        } catch (error) {
            console.error('Error saving users:', error);
            alert('Error saving user data. Please try again.');
        }
    }

    // Generate a unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Hash password (in a real app, use a proper hashing library)
    hashPassword(password) {
        // This is a simple hash for demonstration purposes only
        // In a real application, use bcrypt or similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    // Authenticate user
    authenticate(username, password) {
        console.log('Authenticating user:', username);
        
        // Find user by username
        const user = this.users.find(u => u.username === username && u.active);
        console.log('Found user:', user);
        
        if (!user) {
            console.log('User not found or inactive');
            return null;
        }
        
        // Check password
        const passwordHash = this.hashPassword(password);
        console.log('Password hash comparison:', {
            provided: passwordHash,
            stored: user.passwordHash
        });
        
        if (user.passwordHash === passwordHash) {
            // Update last login time
            user.lastLogin = new Date().toISOString();
            this.saveUsers(this.users);
            
            // Set current user
            this.currentUser = user;
            this.saveCurrentUser(user);
            
            console.log('Authentication successful');
            return user;
        }
        
        console.log('Authentication failed: incorrect password');
        return null;
    }

    // Check if user has permission
    hasPermission(userId, permission) {
        console.log('Checking permission:', { userId, permission });
        
        // If no user ID provided, use current user
        if (!userId && this.currentUser) {
            userId = this.currentUser.id;
        }
        
        const user = this.users.find(u => u.id === userId);
        if (!user || !user.active) {
            console.log('User not found or inactive');
            return false;
        }
        
        const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
        const hasPermission = rolePermissions.includes(permission);
        
        console.log('Permission check result:', {
            role: user.role,
            rolePermissions,
            hasPermission
        });
        
        return hasPermission;
    }

    // Create a new user
    createUser(userData, creatorId) {
        console.log('Creating new user:', userData);
        
        // If no creator ID provided, use current user
        if (!creatorId && this.currentUser) {
            creatorId = this.currentUser.id;
        }
        
        // Check creator permissions
        const creator = this.users.find(u => u.id === creatorId);
        if (!creator) {
            console.error('Creator not found');
            throw new Error('Unauthorized to create users');
        }
        
        const hasPermission = this.hasPermission(creatorId, PERMISSIONS.CREATE_USERS);
        if (!hasPermission) {
            console.error('Creator does not have permission to create users');
            throw new Error('Unauthorized to create users');
        }

        // Check if username already exists
        if (this.users.some(u => u.username === userData.username)) {
            console.error('Username already exists');
            throw new Error('Username already exists');
        }

        const newUser = {
            id: this.generateId(),
            username: userData.username,
            passwordHash: this.hashPassword(userData.password),
            fullName: userData.fullName || '',
            role: userData.role,
            email: userData.email || '',
            createdBy: creatorId,
            createdAt: new Date().toISOString(),
            lastLogin: null,
            active: true
        };

        // Add user to array
        this.users.push(newUser);
        
        // Save updated users array
        this.saveUsers(this.users);
        
        console.log('User created successfully:', newUser);
        return newUser;
    }

    // Update an existing user
    updateUser(userId, userData, editorId) {
        console.log('Updating user:', { userId, userData });
        
        // If no editor ID provided, use current user
        if (!editorId && this.currentUser) {
            editorId = this.currentUser.id;
        }
        
        // Check editor permissions
        const editor = this.users.find(u => u.id === editorId);
        if (!editor) {
            console.error('Editor not found');
            throw new Error('Unauthorized to edit users');
        }
        
        const hasPermission = this.hasPermission(editorId, PERMISSIONS.EDIT_USERS);
        if (!hasPermission) {
            console.error('Editor does not have permission to edit users');
            throw new Error('Unauthorized to edit users');
        }

        // Super admin can only be edited by themselves
        const userToUpdate = this.users.find(u => u.id === userId);
        if (!userToUpdate) {
            console.error('User to update not found');
            throw new Error('User not found');
        }
        
        if (userToUpdate.role === USER_ROLES.SUPER_ADMIN && editorId !== userId) {
            console.error('Cannot edit super admin account');
            throw new Error('Cannot edit super admin account');
        }

        // Find and update the user
        const updatedUsers = this.users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    username: userData.username || user.username,
                    passwordHash: userData.password ? this.hashPassword(userData.password) : user.passwordHash,
                    fullName: userData.fullName || user.fullName,
                    role: userData.role || user.role,
                    email: userData.email || user.email,
                    active: userData.active !== undefined ? userData.active : user.active
                };
            }
            return user;
        });

        this.users = updatedUsers;
        this.saveUsers(this.users);
        
        // If updating current user, update session storage too
        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users.find(u => u.id === userId);
            this.saveCurrentUser(this.currentUser);
        }
        
        console.log('User updated successfully');
        return this.users.find(u => u.id === userId);
    }

    // Delete a user
    deleteUser(userId, deleterId) {
        console.log('Deleting user:', userId);
        
        // If no deleter ID provided, use current user
        if (!deleterId && this.currentUser) {
            deleterId = this.currentUser.id;
        }
        
        // Check deleter permissions
        const deleter = this.users.find(u => u.id === deleterId);
        if (!deleter) {
            console.error('Deleter not found');
            throw new Error('Unauthorized to delete users');
        }
        
        const hasPermission = this.hasPermission(deleterId, PERMISSIONS.DELETE_USERS);
        if (!hasPermission) {
            console.error('Deleter does not have permission to delete users');
            throw new Error('Unauthorized to delete users');
        }

        // Cannot delete super admin
        const userToDelete = this.users.find(u => u.id === userId);
        if (!userToDelete) {
            console.error('User to delete not found');
            throw new Error('User not found');
        }
        
        if (userToDelete.role === USER_ROLES.SUPER_ADMIN) {
            console.error('Cannot delete super admin account');
            throw new Error('Cannot delete super admin account');
        }

        // Remove the user
        this.users = this.users.filter(user => user.id !== userId);
        this.saveUsers(this.users);
        
        console.log('User deleted successfully');
        return true;
    }

    // Get all users (for admin interface)
    getAllUsers(requesterId) {
        console.log('Getting all users');
        
        // If no requester ID provided, use current user
        if (!requesterId && this.currentUser) {
            requesterId = this.currentUser.id;
        }
        
        // Check requester permissions
        const requester = this.users.find(u => u.id === requesterId);
        if (!requester) {
            console.error('Requester not found');
            throw new Error('Unauthorized to view all users');
        }
        
        const hasPermission = this.hasPermission(requesterId, PERMISSIONS.VIEW_ALL_REPORTS);
        if (!hasPermission) {
            console.error('Requester does not have permission to view all users');
            throw new Error('Unauthorized to view all users');
        }
        
        console.log('Returning all users');
        return this.users;
    }

    // Get user by ID
    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    // Log out current user
    logout() {
        console.log('Logging out current user');
        this.currentUser = null;
        this.saveCurrentUser(null);
    }
}

// Initialize user manager
let userManager = new UserManager();

// Initialize user management functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing user management');
    
    // Ensure userManager is initialized
    if (!userManager) {
        console.log('Re-initializing userManager');
        userManager = new UserManager();
    }
    
    // Set up user management UI if on admin page
    if (document.getElementById('user-management-tab') || document.getElementById('user-management')) {
        console.log('User management page detected, setting up UI');
        setupUserManagementUI();
    }
    
    // Add user management tab to dashboard if user has permission
    if (userManager.currentUser && userManager.hasPermission(userManager.currentUser.id, PERMISSIONS.CREATE_USERS)) {
        addUserManagementTab();
    }
});

// Add user management tab to dashboard
function addUserManagementTab() {
    console.log('Adding user management tab to dashboard');
    
    const tabsContainer = document.querySelector('.tabs');
    if (!tabsContainer) {
        console.error('Tabs container not found');
        return;
    }
    
    // Check if tab already exists
    if (document.querySelector('[data-tab="user-management"]')) {
        console.log('User management tab already exists');
        return;
    }
    
    // Create and add tab
    const userManagementTab = document.createElement('div');
    userManagementTab.className = 'tab';
    userManagementTab.setAttribute('data-tab', 'user-management');
    userManagementTab.setAttribute('data-lang-en', 'User Management');
    userManagementTab.setAttribute('data-lang-ar', 'إدارة المستخدمين');
    userManagementTab.textContent = 'User Management';
    
    tabsContainer.appendChild(userManagementTab);
    
    // Add tab content container if it doesn't exist
    if (!document.getElementById('user-management')) {
        const tabContent = document.createElement('div');
        tabContent.id = 'user-management';
        tabContent.className = 'tab-content';
        tabContent.innerHTML = `
            <div class="form-container">
                <h3 data-lang-en="User Management" data-lang-ar="إدارة المستخدمين">User Management</h3>
                
                <div class="mb-4">
                    <button class="btn btn-primary" id="create-user-button" data-lang-en="Create New User" data-lang-ar="إنشاء مستخدم جديد">Create New User</button>
                </div>
                
                <div id="user-list">
                    <p class="text-muted" data-lang-en="Loading users..." data-lang-ar="جاري تحميل المستخدمين...">Loading users...</p>
                </div>
            </div>
        `;
        
        document.querySelector('.container').appendChild(tabContent);
        
        // Add event listener to create user button
        document.getElementById('create-user-button').addEventListener('click', showCreateUserModal);
    }
    
    // Add event listener to tab
    userManagementTab.addEventListener('click', function() {
        activateTab('user-management');
    });
    
    console.log('User management tab added successfully');
}

// Set up user management UI
function setupUserManagementUI() {
    console.log('Setting up user management UI');
    
    // Load user list
    loadUserList();
    
    // Set up event listeners for user management forms
    const createUserForm = document.getElementById('create-user-form');
    if (createUserForm) {
        console.log('Adding event listener to create user form');
        createUserForm.addEventListener('submit', handleCreateUser);
    } else {
        console.warn('Create user form not found');
    }
    
    const editUserForm = document.getElementById('edit-user-form');
    if (editUserForm) {
        console.log('Adding event listener to edit user form');
        editUserForm.addEventListener('submit', handleEditUser);
    } else {
        console.warn('Edit user form not found');
    }
    
    // Add event listener to create user button if it exists
    const createUserButton = document.getElementById('create-user-button');
    if (createUserButton) {
        console.log('Adding event listener to create user button');
        createUserButton.addEventListener('click', showCreateUserModal);
    }
    
    // Create modals if they don't exist
    ensureModalsExist();
}

// Ensure modals exist in the DOM
function ensureModalsExist() {
    console.log('Ensuring modals exist');
    
    // Check if create user modal exists
    if (!document.getElementById('create-user-modal')) {
        console.log('Creating create user modal');
        const createUserModal = document.createElement('div');
        createUserModal.className = 'modal';
        createUserModal.id = 'create-user-modal';
        createUserModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-lang-en="Create New User" data-lang-ar="إنشاء مستخدم جديد">Create New User</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="create-user-form">
                            <div class="form-group">
                                <label for="new-username" data-lang-en="Username" data-lang-ar="اسم المستخدم">Username</label>
                                <input type="text" id="new-username" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="new-password" data-lang-en="Password" data-lang-ar="كلمة المرور">Password</label>
                                <input type="password" id="new-password" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirm-password" data-lang-en="Confirm Password" data-lang-ar="تأكيد كلمة المرور">Confirm Password</label>
                                <input type="password" id="confirm-password" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="new-full-name" data-lang-en="Full Name" data-lang-ar="الاسم الكامل">Full Name</label>
                                <input type="text" id="new-full-name" class="form-control">
                            </div>
                            
                            <div class="form-group">
                                <label for="new-email" data-lang-en="Email" data-lang-ar="البريد الإلكتروني">Email</label>
                                <input type="email" id="new-email" class="form-control">
                            </div>
                            
                            <div class="form-group">
                                <label for="new-role" data-lang-en="Role" data-lang-ar="الدور">Role</label>
                                <select id="new-role" class="form-control">
                                    <option value="admin" data-lang-en="Admin" data-lang-ar="مدير">Admin</option>
                                    <option value="supervisor" data-lang-en="Supervisor" data-lang-ar="مشرف">Supervisor</option>
                                    <option value="regular_user" data-lang-en="Regular User" data-lang-ar="مستخدم عادي">Regular User</option>
                                </select>
                            </div>
                            
                            <div class="btn-group">
                                <button type="submit" class="btn btn-primary" data-lang-en="Create User" data-lang-ar="إنشاء المستخدم">Create User</button>
                                <button type="button" class="btn btn-secondary modal-close" data-lang-en="Cancel" data-lang-ar="إلغاء">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(createUserModal);
        
        // Add event listener to form
        document.getElementById('create-user-form').addEventListener('submit', handleCreateUser);
        
        // Add event listeners to close buttons
        createUserModal.querySelectorAll('.close, .modal-close').forEach(btn => {
            btn.addEventListener('click', () => hideModal('create-user-modal'));
        });
    }
    
    // Check if edit user modal exists
    if (!document.getElementById('edit-user-modal')) {
        console.log('Creating edit user modal');
        const editUserModal = document.createElement('div');
        editUserModal.className = 'modal';
        editUserModal.id = 'edit-user-modal';
        editUserModal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" data-lang-en="Edit User" data-lang-ar="تعديل المستخدم">Edit User</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-user-form">
                            <input type="hidden" id="edit-user-id">
                            
                            <div class="form-group">
                                <label for="edit-username" data-lang-en="Username" data-lang-ar="اسم المستخدم">Username</label>
                                <input type="text" id="edit-username" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-password" data-lang-en="Password" data-lang-ar="كلمة المرور">Password</label>
                                <input type="password" id="edit-password" class="form-control" placeholder="Leave blank to keep current password">
                                <small class="form-text text-muted" data-lang-en="Leave blank to keep current password" data-lang-ar="اتركه فارغًا للاحتفاظ بكلمة المرور الحالية">Leave blank to keep current password</small>
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-full-name" data-lang-en="Full Name" data-lang-ar="الاسم الكامل">Full Name</label>
                                <input type="text" id="edit-full-name" class="form-control">
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-email" data-lang-en="Email" data-lang-ar="البريد الإلكتروني">Email</label>
                                <input type="email" id="edit-email" class="form-control">
                            </div>
                            
                            <div class="form-group">
                                <label for="edit-role" data-lang-en="Role" data-lang-ar="الدور">Role</label>
                                <select id="edit-role" class="form-control">
                                    <option value="super_admin" data-lang-en="Super Admin" data-lang-ar="مدير النظام">Super Admin</option>
                                    <option value="admin" data-lang-en="Admin" data-lang-ar="مدير">Admin</option>
                                    <option value="supervisor" data-lang-en="Supervisor" data-lang-ar="مشرف">Supervisor</option>
                                    <option value="regular_user" data-lang-en="Regular User" data-lang-ar="مستخدم عادي">Regular User</option>
                                </select>
                            </div>
                            
                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="edit-active">
                                <label class="form-check-label" for="edit-active" data-lang-en="Active" data-lang-ar="نشط">Active</label>
                            </div>
                            
                            <div class="btn-group">
                                <button type="submit" class="btn btn-primary" data-lang-en="Save Changes" data-lang-ar="حفظ التغييرات">Save Changes</button>
                                <button type="button" class="btn btn-secondary modal-close" data-lang-en="Cancel" data-lang-ar="إلغاء">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(editUserModal);
        
        // Add event listener to form
        document.getElementById('edit-user-form').addEventListener('submit', handleEditUser);
        
        // Add event listeners to close buttons
        editUserModal.querySelectorAll('.close, .modal-close').forEach(btn => {
            btn.addEventListener('click', () => hideModal('edit-user-modal'));
        });
    }
    
    // Add CSS for modals if not already present
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }
            .modal.show {
                display: block;
            }
            .modal-dialog {
                margin: 10% auto;
                width: 90%;
                max-width: 600px;
            }
            .modal-content {
                background-color: #fefefe;
                padding: 20px;
                border: 1px solid #888;
                border-radius: 5px;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ddd;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .close {
                color: #aaa;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                background: none;
                border: none;
            }
            .close:hover {
                color: black;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-control {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .btn-group {
                margin-top: 20px;
            }
        `;
        
        document.head.appendChild(modalStyles);
    }
}

// Show modal
function showModal(modalId) {
    console.log('Showing modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    } else {
        console.error('Modal not found:', modalId);
    }
}

// Hide modal
function hideModal(modalId) {
    console.log('Hiding modal:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    } else {
        console.error('Modal not found:', modalId);
    }
}

// Show create user modal
function showCreateUserModal() {
    console.log('Showing create user modal');
    
    // Reset form
    const form = document.getElementById('create-user-form');
    if (form) {
        form.reset();
    }
    
    // Show modal
    showModal('create-user-modal');
}

// Load user list into UI
function loadUserList() {
    console.log('Loading user list');
    
    const userListContainer = document.getElementById('user-list');
    if (!userListContainer) {
        console.error('User list container not found');
        return;
    }
    
    try {
        // Ensure userManager is initialized
        if (!userManager) {
            console.log('Re-initializing userManager');
            userManager = new UserManager();
        }
        
        // Check if current user is set
        if (!userManager.currentUser) {
            console.error('No current user set');
            userListContainer.innerHTML = '<div class="alert alert-danger">You must be logged in to view users</div>';
            return;
        }
        
        const users = userManager.getAllUsers(userManager.currentUser.id);
        console.log('Loaded users:', users);
        
        if (users.length === 0) {
            userListContainer.innerHTML = '<p class="text-muted">No users found.</p>';
            return;
        }
        
        let html = '<div class="table-responsive"><table class="table table-striped">';
        html += '<thead><tr><th>Username</th><th>Full Name</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>';
        html += '<tbody>';
        
        users.forEach(user => {
            html += `<tr>
                <td>${user.username}</td>
                <td>${user.fullName}</td>
                <td>${getRoleName(user.role)}</td>
                <td>${user.active ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-danger">Inactive</span>'}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user-btn" data-id="${user.id}">Edit</button>
                    ${user.role !== USER_ROLES.SUPER_ADMIN ? `<button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}">Delete</button>` : ''}
                </td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        userListContainer.innerHTML = html;
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-user-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditUserModal(btn.getAttribute('data-id')));
        });
        
        document.querySelectorAll('.delete-user-btn').forEach(btn => {
            btn.addEventListener('click', () => confirmDeleteUser(btn.getAttribute('data-id')));
        });
    } catch (error) {
        console.error('Error loading user list:', error);
        userListContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    }
}

// Handle create user form submission
function handleCreateUser(e) {
    e.preventDefault();
    console.log('Handling create user form submission');
    
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const fullName = document.getElementById('new-full-name').value;
    const email = document.getElementById('new-email').value;
    const role = document.getElementById('new-role').value;
    
    console.log('Form data:', { username, fullName, email, role });
    
    // Validate input
    if (!username || !password) {
        console.error('Username and password are required');
        showNotification('Username and password are required', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        // Ensure userManager is initialized
        if (!userManager) {
            console.log('Re-initializing userManager');
            userManager = new UserManager();
        }
        
        // Check if current user is set
        if (!userManager.currentUser) {
            console.error('No current user set');
            showNotification('You must be logged in to create users', 'error');
            return;
        }
        
        userManager.createUser({
            username,
            password,
            fullName,
            email,
            role
        }, userManager.currentUser.id);
        
        // Reset form and reload user list
        e.target.reset();
        loadUserList();
        
        // Hide modal
        hideModal('create-user-modal');
        
        showNotification('User created successfully', 'success');
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification(error.message, 'error');
    }
}

// Handle edit user form submission
function handleEditUser(e) {
    e.preventDefault();
    console.log('Handling edit user form submission');
    
    const userId = document.getElementById('edit-user-id').value;
    const username = document.getElementById('edit-username').value;
    const password = document.getElementById('edit-password').value;
    const fullName = document.getElementById('edit-full-name').value;
    const email = document.getElementById('edit-email').value;
    const role = document.getElementById('edit-role').value;
    const active = document.getElementById('edit-active').checked;
    
    console.log('Form data:', { userId, username, fullName, email, role, active });
    
    // Validate input
    if (!username) {
        console.error('Username is required');
        showNotification('Username is required', 'error');
        return;
    }
    
    try {
        // Ensure userManager is initialized
        if (!userManager) {
            console.log('Re-initializing userManager');
            userManager = new UserManager();
        }
        
        // Check if current user is set
        if (!userManager.currentUser) {
            console.error('No current user set');
            showNotification('You must be logged in to edit users', 'error');
            return;
        }
        
        userManager.updateUser(userId, {
            username,
            password: password || undefined, // Only update password if provided
            fullName,
            email,
            role,
            active
        }, userManager.currentUser.id);
        
        // Reset form and reload user list
        loadUserList();
        
        // Hide modal
        hideModal('edit-user-modal');
        
        showNotification('User updated successfully', 'success');
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification(error.message, 'error');
    }
}

// Open edit user modal
function openEditUserModal(userId) {
    console.log('Opening edit user modal for user:', userId);
    
    // Ensure userManager is initialized
    if (!userManager) {
        console.log('Re-initializing userManager');
        userManager = new UserManager();
    }
    
    const user = userManager.getUserById(userId);
    if (!user) {
        console.error('User not found');
        showNotification('User not found', 'error');
        return;
    }
    
    console.log('User data:', user);
    
    // Populate form fields
    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-password').value = ''; // Don't show password
    document.getElementById('edit-full-name').value = user.fullName;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-role').value = user.role;
    document.getElementById('edit-active').checked = user.active;
    
    // Disable role field for super admin
    const roleField = document.getElementById('edit-role');
    if (user.role === USER_ROLES.SUPER_ADMIN) {
        roleField.disabled = true;
    } else {
        roleField.disabled = false;
    }
    
    // Show modal
    showModal('edit-user-modal');
}

// Confirm and delete user
function confirmDeleteUser(userId) {
    console.log('Confirming delete for user:', userId);
    
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        try {
            // Ensure userManager is initialized
            if (!userManager) {
                console.log('Re-initializing userManager');
                userManager = new UserManager();
            }
            
            // Check if current user is set
            if (!userManager.currentUser) {
                console.error('No current user set');
                showNotification('You must be logged in to delete users', 'error');
                return;
            }
            
            userManager.deleteUser(userId, userManager.currentUser.id);
            loadUserList();
            showNotification('User deleted successfully', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showNotification(error.message, 'error');
        }
    }
}

// Get readable role name
function getRoleName(role) {
    switch (role) {
        case USER_ROLES.SUPER_ADMIN:
            return 'Super Admin';
        case USER_ROLES.ADMIN:
            return 'Admin';
        case USER_ROLES.SUPERVISOR:
            return 'Supervisor';
        case USER_ROLES.REGULAR_USER:
            return 'Regular User';
        default:
            return role;
    }
}

// Show notification to user
function showNotification(message, type) {
    console.log('Showing notification:', { message, type });
    
    // Check if notification container exists, create if not
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : (type === 'success' ? 'success' : 'info')}`;
    notification.style.marginBottom = '10px';
    notification.style.minWidth = '300px';
    notification.textContent = message;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            if (notification.parentNode === notificationContainer) {
                notificationContainer.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Function to activate a tab
function activateTab(tabId) {
    console.log('Activating tab:', tabId);
    
    // Remove active class from all tabs and tab contents
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected tab and tab content
    const selectedTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    // If activating user management tab, load user list
    if (tabId === 'user-management') {
        loadUserList();
    }
}

// Export userManager for use in other scripts
window.userManager = userManager;
