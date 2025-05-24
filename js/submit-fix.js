// Submit Button Fix for Security Department Management System

// This script fixes the submit button issues across all forms
// It ensures proper form validation, data storage, and user feedback

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing submit button fixes');
    
    // Fix security report form submission
    fixSecurityReportSubmission();
    
    // Fix CCTV report form submission
    fixCCTVReportSubmission();
    
    // Fix inspection form submission
    fixInspectionFormSubmission();
});

// Fix security report form submission
function fixSecurityReportSubmission() {
    const form = document.getElementById('security-report-form');
    if (!form) {
        console.error('Security report form not found');
        return;
    }
    
    console.log('Fixing security report form submission');
    
    // Remove any existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new event listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Security report form submitted');
        
        try {
            // Validate form
            if (!validateSecurityReportForm()) {
                return;
            }
            
            // Get form data
            const report = {
                id: generateId(),
                type: 'security',
                date: document.getElementById('security-report-date').value,
                time: document.getElementById('security-report-time').value,
                shift: document.getElementById('security-report-shift').value,
                officerName: document.getElementById('security-officer-name').value,
                eventDescription: document.getElementById('security-event-description').value,
                fireAlarm: document.querySelector('input[name="security-fire-alarm"]:checked').value,
                fireAlarmDetails: document.getElementById('security-fire-alarm-details').value || '',
                reportedItems: document.querySelector('input[name="security-reported-items"]:checked').value,
                itemDetails: document.getElementById('security-item-details').value || '',
                reporterInfo: document.getElementById('security-reporter-info').value || '',
                createdAt: new Date().toISOString(),
                createdBy: getCurrentUser()
            };
            
            // Save report to storage
            saveReportToStorage('security-reports', report);
            
            // Show success message
            showNotification('Security report submitted successfully', 'success');
            
            // Send email notification
            sendEmailNotification('security', report);
            
            // Reset form
            newForm.reset();
            
            // Set current date and time
            setCurrentDateInForms();
            
            // Reload recent reports
            loadRecentReports();
            
            // Go back to dashboard
            activateTab('dashboard');
        } catch (error) {
            console.error('Error submitting security report:', error);
            showNotification('Error submitting report: ' + error.message, 'error');
        }
    });
}

// Fix CCTV report form submission
function fixCCTVReportSubmission() {
    const form = document.getElementById('cctv-report-form');
    if (!form) {
        console.error('CCTV report form not found');
        return;
    }
    
    console.log('Fixing CCTV report form submission');
    
    // Remove any existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new event listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('CCTV report form submitted');
        
        try {
            // Validate form
            if (!validateCCTVReportForm()) {
                return;
            }
            
            // Get form data
            const report = {
                id: generateId(),
                type: 'cctv',
                date: document.getElementById('cctv-report-date').value,
                time: document.getElementById('cctv-report-time').value,
                shift: document.getElementById('cctv-report-shift').value,
                officerName: document.getElementById('cctv-officer-name').value,
                camerasFunctioning: document.querySelector('input[name="cctv-cameras-functioning"]:checked').value,
                cameraIssues: document.getElementById('cctv-camera-issues').value || '',
                footageReviewed: document.getElementById('cctv-footage-reviewed').value || '',
                incidentsObserved: document.querySelector('input[name="cctv-incidents-observed"]:checked').value,
                incidentDetails: document.getElementById('cctv-incident-details').value || '',
                footageSaved: document.querySelector('input[name="cctv-footage-saved"]:checked') ? 
                    document.querySelector('input[name="cctv-footage-saved"]:checked').value : 'no',
                footageLocation: document.getElementById('cctv-footage-location').value || '',
                storageCapacity: document.getElementById('cctv-storage-capacity').value || '',
                storageAdequate: document.querySelector('input[name="cctv-storage-adequate"]:checked').value,
                createdAt: new Date().toISOString(),
                createdBy: getCurrentUser()
            };
            
            // Save report to storage
            saveReportToStorage('cctv-reports', report);
            
            // Show success message
            showNotification('CCTV report submitted successfully', 'success');
            
            // Send email notification
            sendEmailNotification('cctv', report);
            
            // Reset form
            newForm.reset();
            
            // Set current date and time
            setCurrentDateInForms();
            
            // Reload recent reports
            loadRecentReports();
            
            // Go back to dashboard
            activateTab('dashboard');
        } catch (error) {
            console.error('Error submitting CCTV report:', error);
            showNotification('Error submitting report: ' + error.message, 'error');
        }
    });
}

// Fix inspection form submission
function fixInspectionFormSubmission() {
    const form = document.getElementById('inspection-form');
    if (!form) {
        console.error('Inspection form not found');
        return;
    }
    
    console.log('Fixing inspection form submission');
    
    // Remove any existing event listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Add new event listener
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Inspection form submitted');
        
        try {
            // Validate form
            if (!validateInspectionForm()) {
                return;
            }
            
            // Get form data
            const inspection = {
                id: generateId(),
                date: document.getElementById('inspection-date').value,
                shift: document.getElementById('inspection-shift').value,
                checklistItems: [],
                additionalFindings: document.getElementById('additional-findings').value || '',
                createdAt: new Date().toISOString(),
                createdBy: getCurrentUser()
            };
            
            // Get checklist items
            for (let i = 1; i <= 12; i++) {
                const checkedValue = document.querySelector(`input[name="checklist-item-${i}"]:checked`);
                inspection.checklistItems.push({
                    id: i,
                    value: checkedValue ? checkedValue.value : 'na'
                });
            }
            
            // Save inspection to storage
            saveReportToStorage('inspections', inspection);
            
            // Show success message
            showNotification('Inspection submitted successfully', 'success');
            
            // Send email notification
            sendEmailNotification('inspection', inspection);
            
            // Reset form
            newForm.reset();
            
            // Re-initialize checklist
            initializeInspectionChecklist();
            
            // Set current date
            setCurrentDateInForms();
            
            // Reload recent reports
            loadRecentReports();
            
            // Go back to dashboard
            activateTab('dashboard');
        } catch (error) {
            console.error('Error submitting inspection:', error);
            showNotification('Error submitting inspection: ' + error.message, 'error');
        }
    });
}

// Validate security report form
function validateSecurityReportForm() {
    console.log('Validating security report form');
    
    // Check required fields
    const date = document.getElementById('security-report-date').value;
    const time = document.getElementById('security-report-time').value;
    const officerName = document.getElementById('security-officer-name').value;
    
    if (!date) {
        showNotification('Please enter a date', 'error');
        return false;
    }
    
    if (!time) {
        showNotification('Please enter a time', 'error');
        return false;
    }
    
    if (!officerName) {
        showNotification('Please enter the security officer name', 'error');
        return false;
    }
    
    // Check conditional fields
    const fireAlarm = document.querySelector('input[name="security-fire-alarm"]:checked').value;
    if (fireAlarm === 'yes') {
        const fireAlarmDetails = document.getElementById('security-fire-alarm-details').value;
        if (!fireAlarmDetails) {
            showNotification('Please provide fire alarm details', 'error');
            return false;
        }
    }
    
    const reportedItems = document.querySelector('input[name="security-reported-items"]:checked').value;
    if (reportedItems === 'yes') {
        const itemDetails = document.getElementById('security-item-details').value;
        const reporterInfo = document.getElementById('security-reporter-info').value;
        
        if (!itemDetails) {
            showNotification('Please provide item details', 'error');
            return false;
        }
        
        if (!reporterInfo) {
            showNotification('Please provide reporter information', 'error');
            return false;
        }
    }
    
    return true;
}

// Validate CCTV report form
function validateCCTVReportForm() {
    console.log('Validating CCTV report form');
    
    // Check required fields
    const date = document.getElementById('cctv-report-date').value;
    const time = document.getElementById('cctv-report-time').value;
    const officerName = document.getElementById('cctv-officer-name').value;
    
    if (!date) {
        showNotification('Please enter a date', 'error');
        return false;
    }
    
    if (!time) {
        showNotification('Please enter a time', 'error');
        return false;
    }
    
    if (!officerName) {
        showNotification('Please enter the security officer name', 'error');
        return false;
    }
    
    // Check conditional fields
    const camerasFunctioning = document.querySelector('input[name="cctv-cameras-functioning"]:checked').value;
    if (camerasFunctioning === 'no') {
        const cameraIssues = document.getElementById('cctv-camera-issues').value;
        if (!cameraIssues) {
            showNotification('Please provide camera issues details', 'error');
            return false;
        }
    }
    
    const incidentsObserved = document.querySelector('input[name="cctv-incidents-observed"]:checked').value;
    if (incidentsObserved === 'yes') {
        const incidentDetails = document.getElementById('cctv-incident-details').value;
        
        if (!incidentDetails) {
            showNotification('Please provide incident details', 'error');
            return false;
        }
        
        const footageSaved = document.querySelector('input[name="cctv-footage-saved"]:checked');
        if (footageSaved && footageSaved.value === 'yes') {
            const footageLocation = document.getElementById('cctv-footage-location').value;
            
            if (!footageLocation) {
                showNotification('Please provide footage location', 'error');
                return false;
            }
        }
    }
    
    return true;
}

// Validate inspection form
function validateInspectionForm() {
    console.log('Validating inspection form');
    
    // Check required fields
    const date = document.getElementById('inspection-date').value;
    
    if (!date) {
        showNotification('Please enter a date', 'error');
        return false;
    }
    
    // Ensure at least one checklist item is checked
    let hasCheckedItem = false;
    for (let i = 1; i <= 12; i++) {
        const checkedValue = document.querySelector(`input[name="checklist-item-${i}"]:checked`);
        if (checkedValue && checkedValue.value !== 'na') {
            hasCheckedItem = true;
            break;
        }
    }
    
    if (!hasCheckedItem) {
        showNotification('Please check at least one checklist item', 'error');
        return false;
    }
    
    return true;
}

// Helper function to get current user
function getCurrentUser() {
    try {
        const currentUserJson = sessionStorage.getItem('currentUser');
        return currentUserJson ? JSON.parse(currentUserJson).username : 'Unknown';
    } catch (error) {
        console.error('Error getting current user:', error);
        return 'Unknown';
    }
}

// Helper function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to save report to storage
function saveReportToStorage(storageKey, report) {
    try {
        console.log(`Saving ${storageKey} to storage:`, report);
        
        // Get existing reports
        const reportsJson = localStorage.getItem(storageKey);
        const reports = reportsJson ? JSON.parse(reportsJson) : [];
        
        // Add new report
        reports.push(report);
        
        // Save back to storage
        localStorage.setItem(storageKey, JSON.stringify(reports));
        
        console.log(`${storageKey} saved successfully`);
        return true;
    } catch (error) {
        console.error(`Error saving ${storageKey} to storage:`, error);
        throw new Error(`Failed to save ${storageKey.replace('-', ' ')}: ${error.message}`);
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

// Set current date in all date fields
function setCurrentDateInForms() {
    const today = new Date().toISOString().split('T')[0];
    
    // Set date in security report form
    const securityDateField = document.getElementById('security-report-date');
    if (securityDateField) {
        securityDateField.value = today;
    }
    
    // Set date in CCTV report form
    const cctvDateField = document.getElementById('cctv-report-date');
    if (cctvDateField) {
        cctvDateField.value = today;
    }
    
    // Set date in inspection form
    const inspectionDateField = document.getElementById('inspection-date');
    if (inspectionDateField) {
        inspectionDateField.value = today;
    }
    
    // Set current time in time fields
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    
    const securityTimeField = document.getElementById('security-report-time');
    if (securityTimeField) {
        securityTimeField.value = currentTime;
    }
    
    const cctvTimeField = document.getElementById('cctv-report-time');
    if (cctvTimeField) {
        cctvTimeField.value = currentTime;
    }
}

// Initialize inspection checklist
function initializeInspectionChecklist() {
    const container = document.getElementById('checklist-items');
    if (!container) return;
    
    // Define checklist items with both English and Arabic text
    const checklistItems = [
        {
            id: 1,
            english: 'Staff are wearing ID badges',
            arabic: 'طاقم العمل يقومون بلبس بطاقات التعريف'
        },
        {
            id: 2,
            english: 'Basements (B1/B2) are secured',
            arabic: 'المواقف السفلية (B1/B2) أمنة'
        },
        {
            id: 3,
            english: 'Server room is secured',
            arabic: 'غرفة الخادم (Server) مقفلة'
        },
        {
            id: 4,
            english: 'CCTV cameras are not obstructed',
            arabic: 'لا يتم إعاقة كاميرات الـمراقبة (CCTV)'
        },
        {
            id: 5,
            english: 'Roof-top door is secured',
            arabic: 'باب سطح مغلق وآمنة'
        },
        {
            id: 6,
            english: 'No smoking activity on the roof-top',
            arabic: 'لا وجود لأنشطة التدخين على السطح'
        },
        {
            id: 7,
            english: 'Emergency exit doors are secured',
            arabic: 'أبواب مخارج الطوارئ مغلقة وآمنة'
        },
        {
            id: 8,
            english: 'Emergency exits are not obstructed inside/outside',
            arabic: 'مخارج الطوارئ لا يتم إعاقتها سواء من الداخل / الخارج'
        },
        {
            id: 9,
            english: 'Handicap parking are not used by cars without handicap sticker',
            arabic: 'لا يتم استخدام مواقف ذوي الاحتياجات الخاصة من قبل أشخاص غير ذوي الاحتياجات الخاصة'
        },
        {
            id: 10,
            english: 'No packages left unattended around the center',
            arabic: 'وجود علب / أكياس دون رقابة حول المركز'
        },
        {
            id: 11,
            english: 'Sidewalks are clear of obstructions',
            arabic: 'الأرصفة حول المركز خالية من العوائق'
        },
        {
            id: 12,
            english: 'No smoking activities around the center',
            arabic: 'لايوجد أنشطة تدخين في جميع أنحاء المركز'
        }
    ];
    
    let html = '';
    
    checklistItems.forEach(item => {
        html += `
            <div class="checklist-item">
                <div class="row">
                    <div class="col-1">${item.id}</div>
                    <div class="col-7">
                        <span data-lang-en="${item.english}" data-lang-ar="${item.arabic}">${item.english}</span>
                    </div>
                    <div class="col-4">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="checklist-item-${item.id}" id="checklist-item-${item.id}-yes" value="yes">
                            <label class="form-check-label" for="checklist-item-${item.id}-yes" data-lang-en="Yes" data-lang-ar="نعم">Y</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="checklist-item-${item.id}" id="checklist-item-${item.id}-no" value="no">
                            <label class="form-check-label" for="checklist-item-${item.id}-no" data-lang-en="No" data-lang-ar="لا">N</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="checklist-item-${item.id}" id="checklist-item-${item.id}-na" value="na" checked>
                            <label class="form-check-label" for="checklist-item-${item.id}-na" data-lang-en="N/A" data-lang-ar="لاينطبق">NA</label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Load recent reports
function loadRecentReports() {
    console.log('Loading recent reports');
    
    // Load security reports
    loadRecentSecurityReports();
    
    // Load CCTV reports
    loadRecentCCTVReports();
    
    // Load inspections
    loadRecentInspections();
}

// Load recent security reports
function loadRecentSecurityReports() {
    const container = document.getElementById('recent-security-reports');
    if (!container) return;
    
    try {
        const reports = getReportsFromStorage('security-reports');
        
        if (reports.length === 0) {
            container.innerHTML = '<p class="text-muted" data-lang-en="No security reports yet." data-lang-ar="لا توجد تقارير أمن حتى الآن.">No security reports yet.</p>';
            return;
        }
        
        // Sort reports by date (newest first)
        reports.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
        
        // Take only the 5 most recent reports
        const recentReports = reports.slice(0, 5);
        
        let html = '<ul class="report-list">';
        
        recentReports.forEach(report => {
            html += `
                <li class="report-item">
                    <div class="report-header">
                        <span class="report-date">${formatDate(report.date)}</span>
                        <span class="report-shift">Shift ${report.shift}</span>
                    </div>
                    <div class="report-officer">${report.officerName}</div>
                    <div class="report-actions">
                        <button class="btn btn-sm btn-info" onclick="viewSecurityReport('${report.id}')">View</button>
                        <button class="btn btn-sm btn-secondary" onclick="downloadSecurityReportPdfById('${report.id}')">PDF</button>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading security reports:', error);
        container.innerHTML = '<p class="text-danger">Error loading reports</p>';
    }
}

// Load recent CCTV reports
function loadRecentCCTVReports() {
    const container = document.getElementById('recent-cctv-reports');
    if (!container) return;
    
    try {
        const reports = getReportsFromStorage('cctv-reports');
        
        if (reports.length === 0) {
            container.innerHTML = '<p class="text-muted" data-lang-en="No CCTV reports yet." data-lang-ar="لا توجد تقارير كاميرات مراقبة حتى الآن.">No CCTV reports yet.</p>';
            return;
        }
        
        // Sort reports by date (newest first)
        reports.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
        
        // Take only the 5 most recent reports
        const recentReports = reports.slice(0, 5);
        
        let html = '<ul class="report-list">';
        
        recentReports.forEach(report => {
            html += `
                <li class="report-item">
                    <div class="report-header">
                        <span class="report-date">${formatDate(report.date)}</span>
                        <span class="report-shift">Shift ${report.shift}</span>
                    </div>
                    <div class="report-officer">${report.officerName}</div>
                    <div class="report-actions">
                        <button class="btn btn-sm btn-info" onclick="viewCCTVReport('${report.id}')">View</button>
                        <button class="btn btn-sm btn-secondary" onclick="downloadCCTVReportPdfById('${report.id}')">PDF</button>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading CCTV reports:', error);
        container.innerHTML = '<p class="text-danger">Error loading reports</p>';
    }
}

// Load recent inspections
function loadRecentInspections() {
    const container = document.getElementById('recent-inspections');
    if (!container) return;
    
    try {
        const inspections = getReportsFromStorage('inspections');
        
        if (inspections.length === 0) {
            container.innerHTML = '<p class="text-muted" data-lang-en="No inspections yet." data-lang-ar="لا توجد عمليات تفتيش حتى الآن.">No inspections yet.</p>';
            return;
        }
        
        // Sort inspections by date (newest first)
        inspections.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Take only the 5 most recent inspections
        const recentInspections = inspections.slice(0, 5);
        
        let html = '<ul class="report-list">';
        
        recentInspections.forEach(inspection => {
            html += `
                <li class="report-item">
                    <div class="report-header">
                        <span class="report-date">${formatDate(inspection.date)}</span>
                        <span class="report-shift">Shift ${inspection.shift}</span>
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-sm btn-info" onclick="viewInspection('${inspection.id}')">View</button>
                        <button class="btn btn-sm btn-secondary" onclick="downloadInspectionPdfById('${inspection.id}')">PDF</button>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading inspections:', error);
        container.innerHTML = '<p class="text-danger">Error loading inspections</p>';
    }
}

// Helper function to get reports from storage
function getReportsFromStorage(storageKey) {
    try {
        const reportsJson = localStorage.getItem(storageKey);
        return reportsJson ? JSON.parse(reportsJson) : [];
    } catch (error) {
        console.error(`Error getting ${storageKey} from storage:`, error);
        return [];
    }
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
}
