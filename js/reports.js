// Reports management for Security Department Management System

// Initialize reports functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing reports functionality');
    
    // Set current date in all date fields
    setCurrentDateInForms();
    
    // Set up event listeners for form submissions
    setupFormSubmissions();
    
    // Set up event listeners for conditional fields
    setupConditionalFields();
    
    // Load recent reports for dashboard
    loadRecentReports();
    
    // Initialize inspection checklist
    initializeInspectionChecklist();
});

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

// Set up event listeners for form submissions
function setupFormSubmissions() {
    // Security report form submission
    const securityReportForm = document.getElementById('security-report-form');
    if (securityReportForm) {
        securityReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Security report form submitted');
            submitSecurityReport();
        });
    }
    
    // CCTV report form submission
    const cctvReportForm = document.getElementById('cctv-report-form');
    if (cctvReportForm) {
        cctvReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('CCTV report form submitted');
            submitCCTVReport();
        });
    }
    
    // Inspection form submission
    const inspectionForm = document.getElementById('inspection-form');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Inspection form submitted');
            submitInspection();
        });
    }
}

// Set up event listeners for conditional fields
function setupConditionalFields() {
    // Security report conditional fields
    setupRadioConditionalField('security-fire-alarm-yes', 'security-fire-alarm-no', 'security-fire-alarm-details-container');
    setupRadioConditionalField('security-reported-items-yes', 'security-reported-items-no', 'security-reported-items-details-container');
    
    // CCTV report conditional fields
    setupRadioConditionalField('cctv-cameras-functioning-no', 'cctv-cameras-functioning-yes', 'cctv-camera-issues-container');
    setupRadioConditionalField('cctv-incidents-observed-yes', 'cctv-incidents-observed-no', 'cctv-incident-details-container');
    setupRadioConditionalField('cctv-footage-saved-yes', 'cctv-footage-saved-no', 'cctv-footage-location-container');
}

// Helper function to set up radio button conditional fields
function setupRadioConditionalField(showRadioId, hideRadioId, containerId) {
    const showRadio = document.getElementById(showRadioId);
    const hideRadio = document.getElementById(hideRadioId);
    const container = document.getElementById(containerId);
    
    if (showRadio && hideRadio && container) {
        showRadio.addEventListener('change', function() {
            if (this.checked) {
                container.classList.remove('hidden');
            }
        });
        
        hideRadio.addEventListener('change', function() {
            if (this.checked) {
                container.classList.add('hidden');
            }
        });
    }
}

// Load recent reports for dashboard
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

// Submit security report
function submitSecurityReport() {
    try {
        console.log('Submitting security report');
        
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
            fireAlarmDetails: document.getElementById('security-fire-alarm-details').value,
            reportedItems: document.querySelector('input[name="security-reported-items"]:checked').value,
            itemDetails: document.getElementById('security-item-details').value,
            reporterInfo: document.getElementById('security-reporter-info').value,
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser()
        };
        
        // Validate required fields
        if (!report.date || !report.time || !report.officerName) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Save report to storage
        saveReportToStorage('security-reports', report);
        
        // Show success message
        showNotification('Security report submitted successfully', 'success');
        
        // Send email notification
        sendEmailNotification('security', report);
        
        // Reset form
        document.getElementById('security-report-form').reset();
        
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
}

// Submit CCTV report
function submitCCTVReport() {
    try {
        console.log('Submitting CCTV report');
        
        // Get form data
        const report = {
            id: generateId(),
            type: 'cctv',
            date: document.getElementById('cctv-report-date').value,
            time: document.getElementById('cctv-report-time').value,
            shift: document.getElementById('cctv-report-shift').value,
            officerName: document.getElementById('cctv-officer-name').value,
            camerasFunctioning: document.querySelector('input[name="cctv-cameras-functioning"]:checked').value,
            cameraIssues: document.getElementById('cctv-camera-issues').value,
            footageReviewed: document.getElementById('cctv-footage-reviewed').value,
            incidentsObserved: document.querySelector('input[name="cctv-incidents-observed"]:checked').value,
            incidentDetails: document.getElementById('cctv-incident-details').value,
            footageSaved: document.querySelector('input[name="cctv-footage-saved"]:checked').value,
            footageLocation: document.getElementById('cctv-footage-location').value,
            storageCapacity: document.getElementById('cctv-storage-capacity').value,
            storageAdequate: document.querySelector('input[name="cctv-storage-adequate"]:checked').value,
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser()
        };
        
        // Validate required fields
        if (!report.date || !report.time || !report.officerName) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Save report to storage
        saveReportToStorage('cctv-reports', report);
        
        // Show success message
        showNotification('CCTV report submitted successfully', 'success');
        
        // Send email notification
        sendEmailNotification('cctv', report);
        
        // Reset form
        document.getElementById('cctv-report-form').reset();
        
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
}

// Submit inspection
function submitInspection() {
    try {
        console.log('Submitting inspection');
        
        // Get form data
        const inspection = {
            id: generateId(),
            date: document.getElementById('inspection-date').value,
            shift: document.getElementById('inspection-shift').value,
            checklistItems: [],
            additionalFindings: document.getElementById('additional-findings').value,
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser()
        };
        
        // Validate required fields
        if (!inspection.date) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
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
        document.getElementById('inspection-form').reset();
        
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
}

// View security report
function viewSecurityReport(reportId) {
    try {
        console.log('Viewing security report:', reportId);
        
        const reports = getReportsFromStorage('security-reports');
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            showNotification('Report not found', 'error');
            return;
        }
        
        // Create modal for viewing report
        let modal = document.getElementById('view-report-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'view-report-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Security Report - ${formatDate(report.date)}</h5>
                        <button type="button" class="close" onclick="hideModal('view-report-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="report-view">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Date:</strong> ${formatDate(report.date)}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Time:</strong> ${report.time}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Shift:</strong> ${report.shift}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Security Officer:</strong> ${report.officerName}</p>
                                </div>
                            </div>
                            <hr>
                            <h6>Event Description</h6>
                            <p>${report.eventDescription || 'No description provided'}</p>
                            <hr>
                            <h6>Fire Alarm</h6>
                            <p>${report.fireAlarm === 'yes' ? 'Yes' : 'No'}</p>
                            ${report.fireAlarm === 'yes' ? `
                                <h6>Fire Alarm Details</h6>
                                <p>${report.fireAlarmDetails || 'No details provided'}</p>
                            ` : ''}
                            <hr>
                            <h6>Reported Items</h6>
                            <p>${report.reportedItems === 'yes' ? 'Yes' : 'No'}</p>
                            ${report.reportedItems === 'yes' ? `
                                <h6>Item Details</h6>
                                <p>${report.itemDetails || 'No details provided'}</p>
                                <h6>Reporter Information</h6>
                                <p>${report.reporterInfo || 'No information provided'}</p>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="hideModal('view-report-modal')">Close</button>
                        <button type="button" class="btn btn-primary" onclick="downloadSecurityReportPdfById('${report.id}')">Download PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        showModal('view-report-modal');
    } catch (error) {
        console.error('Error viewing security report:', error);
        showNotification('Error viewing report: ' + error.message, 'error');
    }
}

// View CCTV report
function viewCCTVReport(reportId) {
    try {
        console.log('Viewing CCTV report:', reportId);
        
        const reports = getReportsFromStorage('cctv-reports');
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            showNotification('Report not found', 'error');
            return;
        }
        
        // Create modal for viewing report
        let modal = document.getElementById('view-report-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'view-report-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">CCTV Report - ${formatDate(report.date)}</h5>
                        <button type="button" class="close" onclick="hideModal('view-report-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="report-view">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Date:</strong> ${formatDate(report.date)}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Time:</strong> ${report.time}</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Shift:</strong> ${report.shift}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Security Officer:</strong> ${report.officerName}</p>
                                </div>
                            </div>
                            <hr>
                            <h6>Cameras Functioning Properly</h6>
                            <p>${report.camerasFunctioning === 'yes' ? 'Yes' : 'No'}</p>
                            ${report.camerasFunctioning === 'no' ? `
                                <h6>Camera Issues</h6>
                                <p>${report.cameraIssues || 'No details provided'}</p>
                            ` : ''}
                            <hr>
                            <h6>Footage Reviewed</h6>
                            <p>${report.footageReviewed || 'None'}</p>
                            <hr>
                            <h6>Incidents Observed</h6>
                            <p>${report.incidentsObserved === 'yes' ? 'Yes' : 'No'}</p>
                            ${report.incidentsObserved === 'yes' ? `
                                <h6>Incident Details</h6>
                                <p>${report.incidentDetails || 'No details provided'}</p>
                                <h6>Footage Saved</h6>
                                <p>${report.footageSaved === 'yes' ? 'Yes' : 'No'}</p>
                                ${report.footageSaved === 'yes' ? `
                                    <h6>Footage Location</h6>
                                    <p>${report.footageLocation || 'No location provided'}</p>
                                ` : ''}
                            ` : ''}
                            <hr>
                            <h6>Storage Capacity</h6>
                            <p>${report.storageCapacity || 'Not specified'}</p>
                            <h6>Storage Adequate</h6>
                            <p>${report.storageAdequate === 'yes' ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="hideModal('view-report-modal')">Close</button>
                        <button type="button" class="btn btn-primary" onclick="downloadCCTVReportPdfById('${report.id}')">Download PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        showModal('view-report-modal');
    } catch (error) {
        console.error('Error viewing CCTV report:', error);
        showNotification('Error viewing report: ' + error.message, 'error');
    }
}

// View inspection
function viewInspection(inspectionId) {
    try {
        console.log('Viewing inspection:', inspectionId);
        
        const inspections = getReportsFromStorage('inspections');
        const inspection = inspections.find(i => i.id === inspectionId);
        
        if (!inspection) {
            showNotification('Inspection not found', 'error');
            return;
        }
        
        // Create modal for viewing inspection
        let modal = document.getElementById('view-report-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'view-report-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
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
        
        // Generate checklist HTML
        let checklistHtml = '<table class="table table-bordered">';
        checklistHtml += '<thead><tr><th>#</th><th>Item</th><th>Status</th></tr></thead>';
        checklistHtml += '<tbody>';
        
        checklistItems.forEach(item => {
            const checklistItem = inspection.checklistItems.find(ci => ci.id === item.id) || { value: 'na' };
            const statusText = checklistItem.value === 'yes' ? 'Yes' : (checklistItem.value === 'no' ? 'No' : 'N/A');
            const statusClass = checklistItem.value === 'yes' ? 'text-success' : (checklistItem.value === 'no' ? 'text-danger' : 'text-muted');
            
            checklistHtml += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.english}</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
            `;
        });
        
        checklistHtml += '</tbody></table>';
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Inspection - ${formatDate(inspection.date)}</h5>
                        <button type="button" class="close" onclick="hideModal('view-report-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="report-view">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Date:</strong> ${formatDate(inspection.date)}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Shift:</strong> ${inspection.shift}</p>
                                </div>
                            </div>
                            <hr>
                            <h6>Checklist Items</h6>
                            ${checklistHtml}
                            <hr>
                            <h6>Additional Findings</h6>
                            <p>${inspection.additionalFindings || 'No additional findings'}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="hideModal('view-report-modal')">Close</button>
                        <button type="button" class="btn btn-primary" onclick="downloadInspectionPdfById('${inspection.id}')">Download PDF</button>
                    </div>
                </div>
            </div>
        `;
        
        showModal('view-report-modal');
    } catch (error) {
        console.error('Error viewing inspection:', error);
        showNotification('Error viewing inspection: ' + error.message, 'error');
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

// Helper function to save report to storage
function saveReportToStorage(storageKey, report) {
    try {
        const reports = getReportsFromStorage(storageKey);
        reports.push(report);
        localStorage.setItem(storageKey, JSON.stringify(reports));
    } catch (error) {
        console.error(`Error saving ${storageKey} to storage:`, error);
        throw error;
    }
}

// Helper function to generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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

// Download security report PDF by ID
function downloadSecurityReportPdfById(reportId) {
    try {
        console.log('Downloading security report PDF:', reportId);
        
        const reports = getReportsFromStorage('security-reports');
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            showNotification('Report not found', 'error');
            return;
        }
        
        // Generate PDF
        generateSecurityReportPdf(report);
    } catch (error) {
        console.error('Error downloading security report PDF:', error);
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Download CCTV report PDF by ID
function downloadCCTVReportPdfById(reportId) {
    try {
        console.log('Downloading CCTV report PDF:', reportId);
        
        const reports = getReportsFromStorage('cctv-reports');
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            showNotification('Report not found', 'error');
            return;
        }
        
        // Generate PDF
        generateCCTVReportPdf(report);
    } catch (error) {
        console.error('Error downloading CCTV report PDF:', error);
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Download inspection PDF by ID
function downloadInspectionPdfById(inspectionId) {
    try {
        console.log('Downloading inspection PDF:', inspectionId);
        
        const inspections = getReportsFromStorage('inspections');
        const inspection = inspections.find(i => i.id === inspectionId);
        
        if (!inspection) {
            showNotification('Inspection not found', 'error');
            return;
        }
        
        // Generate PDF
        generateInspectionPdf(inspection);
    } catch (error) {
        console.error('Error downloading inspection PDF:', error);
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Download current security report as PDF
function downloadSecurityReportPdf() {
    try {
        console.log('Downloading current security report as PDF');
        
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
            fireAlarmDetails: document.getElementById('security-fire-alarm-details').value,
            reportedItems: document.querySelector('input[name="security-reported-items"]:checked').value,
            itemDetails: document.getElementById('security-item-details').value,
            reporterInfo: document.getElementById('security-reporter-info').value,
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser()
        };
        
        // Validate required fields
        if (!report.date || !report.time || !report.officerName) {
            showNotification('Please fill in all required fields before downloading PDF', 'error');
            return;
        }
        
        // Generate PDF
        generateSecurityReportPdf(report);
    } catch (error) {
        console.error('Error downloading security report PDF:', error);
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Download current CCTV report as PDF
function downloadCCTVReportPdf() {
    try {
        console.log('Downloading current CCTV report as PDF');
        
        // Get form data
        const report = {
            id: generateId(),
            type: 'cctv',
            date: document.getElementById('cctv-report-date').value,
            time: document.getElementById('cctv-report-time').value,
            shift: document.getElementById('cctv-report-shift').value,
            officerName: document.getElementById('cctv-officer-name').value,
            camerasFunctioning: document.querySelector('input[name="cctv-cameras-functioning"]:checked').value,
            cameraIssues: document.getElementById('cctv-camera-issues').value,
            footageReviewed: document.getElementById('cctv-footage-reviewed').value,
            incidentsObserved: document.querySelector('input[name="cctv-incidents-observed"]:checked').value,
            incidentDetails: document.getElementById('cctv-incident-details').value,
            footageSaved: document.querySelector('input[name="cctv-footage-saved"]:checked').value,
            footageLocation: document.getElementById('cctv-footage-location').value,
            storageCapacity: document.getElementById('cctv-storage-capacity').value,
            storageAdequate: document.querySelector('input[name="cctv-storage-adequate"]:checked').value,
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser()
        };
        
        // Validate required fields
        if (!report.date || !report.time || !report.officerName) {
            showNotification('Please fill in all required fields before downloading PDF', 'error');
            return;
        }
        
        // Generate PDF
        generateCCTVReportPdf(report);
    } catch (error) {
        console.error('Error downloading CCTV report PDF:', error);
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Download current inspection as PDF
function downloadInspectionPdf() {
    try {
        console.log('Downloading current inspection as PDF');
        
        // Get form data
        const inspection = {
            id: generateId(),
            date: document.getElementById('inspection-date').value,
            shift: document.getElementById('inspection-shift').value,
            checklistItems: [],
            additionalFindings: document.getElementById('additional-findings').value,
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser()
        };
        
        // Validate required fields
        if (!inspection.date) {
            showNotification('Please fill in all required fields before downloading PDF', 'error');
            return;
        }
        
        // Get checklist items
        for (let i = 1; i <= 12; i++) {
            const checkedValue = document.querySelector(`input[name="checklist-item-${i}"]:checked`);
            inspection.checklistItems.push({
                id: i,
                value: checkedValue ? checkedValue.value : 'na'
            });
        }
        
        // Generate PDF
        generateInspectionPdf(inspection);
    } catch (error) {
        console.error('Error downloading inspection PDF:', error);
        showNotification('Error downloading PDF: ' + error.message, 'error');
    }
}

// Generate security report PDF
function generateSecurityReportPdf(report) {
    try {
        console.log('Generating security report PDF');
        
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add company logo
        const logoImg = document.getElementById('company-logo');
        if (logoImg) {
            doc.addImage(logoImg, 'JPEG', 10, 10, 50, 20);
        }
        
        // Add title
        doc.setFontSize(18);
        doc.text('Security Report', 105, 20, { align: 'center' });
        
        // Add report details
        doc.setFontSize(12);
        doc.text(`Date: ${formatDate(report.date)}`, 20, 40);
        doc.text(`Time: ${report.time}`, 20, 50);
        doc.text(`Shift: ${report.shift}`, 20, 60);
        doc.text(`Security Officer: ${report.officerName}`, 20, 70);
        
        // Add event description
        doc.setFontSize(14);
        doc.text('Event Description', 20, 90);
        doc.setFontSize(12);
        
        // Handle multiline text
        const eventDescLines = doc.splitTextToSize(report.eventDescription || 'No description provided', 170);
        doc.text(eventDescLines, 20, 100);
        
        // Add fire alarm section
        let yPos = 100 + (eventDescLines.length * 7);
        doc.setFontSize(14);
        doc.text('Fire Alarm', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        doc.text(`Fire Alarm Activated: ${report.fireAlarm === 'yes' ? 'Yes' : 'No'}`, 20, yPos);
        
        if (report.fireAlarm === 'yes') {
            yPos += 10;
            doc.setFontSize(14);
            doc.text('Fire Alarm Details', 20, yPos);
            doc.setFontSize(12);
            yPos += 10;
            const fireAlarmLines = doc.splitTextToSize(report.fireAlarmDetails || 'No details provided', 170);
            doc.text(fireAlarmLines, 20, yPos);
            yPos += (fireAlarmLines.length * 7);
        }
        
        // Add reported items section
        yPos += 20;
        doc.setFontSize(14);
        doc.text('Reported Items', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        doc.text(`Reported Items: ${report.reportedItems === 'yes' ? 'Yes' : 'No'}`, 20, yPos);
        
        if (report.reportedItems === 'yes') {
            yPos += 10;
            doc.setFontSize(14);
            doc.text('Item Details', 20, yPos);
            doc.setFontSize(12);
            yPos += 10;
            const itemDetailsLines = doc.splitTextToSize(report.itemDetails || 'No details provided', 170);
            doc.text(itemDetailsLines, 20, yPos);
            yPos += (itemDetailsLines.length * 7);
            
            yPos += 10;
            doc.setFontSize(14);
            doc.text('Reporter Information', 20, yPos);
            doc.setFontSize(12);
            yPos += 10;
            const reporterInfoLines = doc.splitTextToSize(report.reporterInfo || 'No information provided', 170);
            doc.text(reporterInfoLines, 20, yPos);
        }
        
        // Add signature line
        yPos = Math.max(yPos + 30, 240);
        doc.line(20, yPos, 100, yPos);
        doc.text('Security Officer Signature', 20, yPos + 10);
        
        // Save PDF
        const fileName = `Security_Report_${report.date.replace(/-/g, '')}_${report.shift}.pdf`;
        doc.save(fileName);
        
        showNotification('PDF downloaded successfully', 'success');
    } catch (error) {
        console.error('Error generating security report PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
    }
}

// Generate CCTV report PDF
function generateCCTVReportPdf(report) {
    try {
        console.log('Generating CCTV report PDF');
        
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add company logo
        const logoImg = document.getElementById('company-logo');
        if (logoImg) {
            doc.addImage(logoImg, 'JPEG', 10, 10, 50, 20);
        }
        
        // Add title
        doc.setFontSize(18);
        doc.text('CCTV Report', 105, 20, { align: 'center' });
        
        // Add report details
        doc.setFontSize(12);
        doc.text(`Date: ${formatDate(report.date)}`, 20, 40);
        doc.text(`Time: ${report.time}`, 20, 50);
        doc.text(`Shift: ${report.shift}`, 20, 60);
        doc.text(`Security Officer: ${report.officerName}`, 20, 70);
        
        // Add cameras functioning section
        doc.setFontSize(14);
        doc.text('Camera Status', 20, 90);
        doc.setFontSize(12);
        doc.text(`Cameras Functioning Properly: ${report.camerasFunctioning === 'yes' ? 'Yes' : 'No'}`, 20, 100);
        
        let yPos = 110;
        if (report.camerasFunctioning === 'no') {
            doc.setFontSize(14);
            doc.text('Camera Issues', 20, yPos);
            doc.setFontSize(12);
            yPos += 10;
            const cameraIssuesLines = doc.splitTextToSize(report.cameraIssues || 'No details provided', 170);
            doc.text(cameraIssuesLines, 20, yPos);
            yPos += (cameraIssuesLines.length * 7);
        }
        
        // Add footage reviewed section
        yPos += 10;
        doc.setFontSize(14);
        doc.text('Footage Reviewed', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        doc.text(`Time Period: ${report.footageReviewed || 'None'}`, 20, yPos);
        
        // Add incidents section
        yPos += 20;
        doc.setFontSize(14);
        doc.text('Incidents', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        doc.text(`Incidents Observed: ${report.incidentsObserved === 'yes' ? 'Yes' : 'No'}`, 20, yPos);
        
        if (report.incidentsObserved === 'yes') {
            yPos += 10;
            doc.setFontSize(14);
            doc.text('Incident Details', 20, yPos);
            doc.setFontSize(12);
            yPos += 10;
            const incidentDetailsLines = doc.splitTextToSize(report.incidentDetails || 'No details provided', 170);
            doc.text(incidentDetailsLines, 20, yPos);
            yPos += (incidentDetailsLines.length * 7);
            
            yPos += 10;
            doc.text(`Footage Saved: ${report.footageSaved === 'yes' ? 'Yes' : 'No'}`, 20, yPos);
            
            if (report.footageSaved === 'yes') {
                yPos += 10;
                doc.text(`Footage Location: ${report.footageLocation || 'No location provided'}`, 20, yPos);
            }
        }
        
        // Add storage section
        yPos += 20;
        doc.setFontSize(14);
        doc.text('Storage Status', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        doc.text(`Storage Capacity: ${report.storageCapacity || 'Not specified'}`, 20, yPos);
        yPos += 10;
        doc.text(`Storage Adequate: ${report.storageAdequate === 'yes' ? 'Yes' : 'No'}`, 20, yPos);
        
        // Add signature line
        yPos = Math.max(yPos + 30, 240);
        doc.line(20, yPos, 100, yPos);
        doc.text('Security Officer Signature', 20, yPos + 10);
        
        // Save PDF
        const fileName = `CCTV_Report_${report.date.replace(/-/g, '')}_${report.shift}.pdf`;
        doc.save(fileName);
        
        showNotification('PDF downloaded successfully', 'success');
    } catch (error) {
        console.error('Error generating CCTV report PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
    }
}

// Generate inspection PDF
function generateInspectionPdf(inspection) {
    try {
        console.log('Generating inspection PDF');
        
        // Create PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add company logo
        const logoImg = document.getElementById('company-logo');
        if (logoImg) {
            doc.addImage(logoImg, 'JPEG', 10, 10, 50, 20);
        }
        
        // Add title
        doc.setFontSize(18);
        doc.text('Security Inspection Checklist', 105, 20, { align: 'center' });
        
        // Add inspection details
        doc.setFontSize(12);
        doc.text(`Date: ${formatDate(inspection.date)}`, 20, 40);
        doc.text(`Shift: ${inspection.shift}`, 20, 50);
        
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
        
        // Add checklist header
        let yPos = 70;
        doc.setFontSize(14);
        doc.text('Checklist Items', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        
        // Add table header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos, 170, 10, 'F');
        doc.text('#', 25, yPos + 7);
        doc.text('Item', 40, yPos + 7);
        doc.text('Y', 160, yPos + 7);
        doc.text('N', 170, yPos + 7);
        doc.text('NA', 180, yPos + 7);
        yPos += 10;
        
        // Add checklist items
        checklistItems.forEach((item, index) => {
            const checklistItem = inspection.checklistItems.find(ci => ci.id === item.id) || { value: 'na' };
            
            // Draw item row
            if (index % 2 === 0) {
                doc.setFillColor(250, 250, 250);
                doc.rect(20, yPos, 170, 10, 'F');
            }
            
            doc.text(item.id.toString(), 25, yPos + 7);
            
            // Handle long item text
            const itemText = doc.splitTextToSize(item.english, 110);
            doc.text(itemText, 40, yPos + 7);
            
            // Draw checkboxes
            if (checklistItem.value === 'yes') {
                doc.text('✓', 160, yPos + 7);
            } else if (checklistItem.value === 'no') {
                doc.text('✓', 170, yPos + 7);
            } else {
                doc.text('✓', 180, yPos + 7);
            }
            
            yPos += 10;
            
            // Add a new page if needed
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        });
        
        // Add additional findings
        yPos += 10;
        doc.setFontSize(14);
        doc.text('Additional Findings', 20, yPos);
        doc.setFontSize(12);
        yPos += 10;
        
        // Handle multiline text
        const findingsLines = doc.splitTextToSize(inspection.additionalFindings || 'No additional findings', 170);
        doc.text(findingsLines, 20, yPos);
        yPos += (findingsLines.length * 7);
        
        // Add signature line
        yPos = Math.max(yPos + 30, 240);
        doc.line(20, yPos, 100, yPos);
        doc.text('Security Officer Signature', 20, yPos + 10);
        
        // Save PDF
        const fileName = `Inspection_${inspection.date.replace(/-/g, '')}_${inspection.shift}.pdf`;
        doc.save(fileName);
        
        showNotification('PDF downloaded successfully', 'success');
    } catch (error) {
        console.error('Error generating inspection PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
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
