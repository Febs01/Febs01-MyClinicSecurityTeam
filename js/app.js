// Updated Main Application JavaScript for Security Department Management System

// Global variables
let currentLanguage = 'en'; // Default language is English
let savedReports = []; // Array to store saved reports
let savedInspections = []; // Array to store saved inspections

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage
    loadSavedData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize forms with current date, time, and shift
    initializeForms();
    
    // Set default language
    setLanguage(currentLanguage);
});

// Load saved data from localStorage
function loadSavedData() {
    if (localStorage.getItem('securityReports')) {
        savedReports = JSON.parse(localStorage.getItem('securityReports'));
    }
    
    if (localStorage.getItem('securityInspections')) {
        savedInspections = JSON.parse(localStorage.getItem('securityInspections'));
    }
    
    // Display saved reports and inspections in the dashboard
    updateDashboard();
}

// Set up event listeners for the application
function setupEventListeners() {
    // Language toggle
    document.getElementById('language-toggle').addEventListener('change', function() {
        currentLanguage = this.checked ? 'ar' : 'en';
        setLanguage(currentLanguage);
    });
    
    // Tab navigation
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
    
    // Daily Report Form
    const dailyReportForm = document.getElementById('daily-report-form');
    if (dailyReportForm) {
        dailyReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveReport();
        });
        
        // Report type selection
        const reportTypeRadios = document.querySelectorAll('input[name="report-type"]');
        reportTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                toggleReportTypeFields(this.value);
            });
        });
        
        // Fire alarm conditional fields
        const fireAlarmRadios = document.querySelectorAll('input[name="fire-alarm"]');
        fireAlarmRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                toggleConditionalField('fire-alarm-details', this.value === 'yes');
            });
        });
        
        // Reported items conditional fields
        const reportedItemsRadios = document.querySelectorAll('input[name="reported-items"]');
        reportedItemsRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                toggleConditionalField('reported-items-details', this.value === 'yes');
            });
        });
        
        // CCTV Report conditional fields
        const camerasFunctioningRadios = document.querySelectorAll('input[name="cameras-functioning"]');
        camerasFunctioningRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                toggleConditionalField('camera-issues', this.value === 'no');
            });
        });
        
        const incidentsObservedRadios = document.querySelectorAll('input[name="incidents-observed"]');
        incidentsObservedRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                toggleConditionalField('incident-details', this.value === 'yes');
            });
        });
    }
    
    // Inspection Checklist Form
    const inspectionForm = document.getElementById('inspection-form');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveInspection();
        });
    }
}

// Initialize forms with current date, time, and shift
function initializeForms() {
    // Set current date
    const currentDate = new Date();
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.valueAsDate = currentDate;
    });
    
    // Set current time
    const timeInputs = document.querySelectorAll('input[type="time"]');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    timeInputs.forEach(input => {
        input.value = currentTime;
    });
    
    // Set current shift based on time
    const currentHour = currentDate.getHours();
    let currentShift = '';
    
    if (currentHour >= 6 && currentHour < 14) {
        currentShift = 'A'; // Morning shift (6 AM - 2 PM)
    } else if (currentHour >= 14 && currentHour < 22) {
        currentShift = 'B'; // Afternoon shift (2 PM - 10 PM)
    } else {
        currentShift = 'C'; // Night shift (10 PM - 6 AM)
    }
    
    const shiftSelects = document.querySelectorAll('select[name="shift"]');
    shiftSelects.forEach(select => {
        select.value = currentShift;
    });
}

// Toggle report type fields based on selection
function toggleReportTypeFields(reportType) {
    const securityFields = document.getElementById('security-report-fields');
    const cctvFields = document.getElementById('cctv-report-fields');
    
    if (reportType === 'security') {
        securityFields.style.display = 'block';
        cctvFields.style.display = 'none';
    } else {
        securityFields.style.display = 'none';
        cctvFields.style.display = 'block';
    }
}

// Toggle conditional fields based on yes/no responses
function toggleConditionalField(fieldId, show) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.display = show ? 'block' : 'none';
        
        // Make fields required or not based on visibility
        const inputs = field.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (show) {
                input.setAttribute('required', '');
            } else {
                input.removeAttribute('required');
            }
        });
    }
}

// Activate tab and show corresponding content
function activateTab(tabId) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Activate selected tab and content
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
}

// Save daily report
function saveReport() {
    const form = document.getElementById('daily-report-form');
    const reportType = form.querySelector('input[name="report-type"]:checked').value;
    
    let report = {
        id: generateId(),
        reportType: reportType,
        date: form.querySelector('input[name="date"]').value,
        time: form.querySelector('input[name="time"]').value,
        shift: form.querySelector('select[name="shift"]').value,
        securityOfficer: form.querySelector('input[name="security-officer"]').value
    };
    
    // Add fields based on report type
    if (reportType === 'security') {
        report = {
            ...report,
            eventDescription: form.querySelector('textarea[name="event-description"]').value,
            fireAlarm: {
                occurred: form.querySelector('input[name="fire-alarm"]:checked').value === 'yes',
                details: form.querySelector('input[name="fire-alarm"]:checked').value === 'yes' ? 
                         form.querySelector('textarea[name="fire-alarm-details"]').value : ''
            },
            reportedItems: {
                received: form.querySelector('input[name="reported-items"]:checked').value === 'yes',
                itemDetails: form.querySelector('input[name="reported-items"]:checked').value === 'yes' ? 
                             form.querySelector('textarea[name="item-details"]').value : '',
                reporterInfo: form.querySelector('input[name="reported-items"]:checked').value === 'yes' ? 
                              form.querySelector('textarea[name="reporter-info"]').value : ''
            }
        };
    } else {
        // CCTV report fields
        report = {
            ...report,
            camerasFunctioning: form.querySelector('input[name="cameras-functioning"]:checked').value,
            cameraIssues: form.querySelector('input[name="cameras-functioning"]:checked').value === 'no' ? 
                          form.querySelector('textarea[name="camera-issues"]').value : '',
            footageReviewed: form.querySelector('input[name="footage-reviewed"]').value,
            incidentsObserved: form.querySelector('input[name="incidents-observed"]:checked').value,
            incidentDetails: form.querySelector('input[name="incidents-observed"]:checked').value === 'yes' ? 
                             form.querySelector('textarea[name="incident-details"]').value : '',
            footageSaved: form.querySelector('input[name="incidents-observed"]:checked').value === 'yes' ? 
                          form.querySelector('input[name="footage-saved"]:checked').value : 'no',
            footageLocation: form.querySelector('input[name="incidents-observed"]:checked').value === 'yes' && 
                             form.querySelector('input[name="footage-saved"]:checked').value === 'yes' ? 
                             form.querySelector('input[name="footage-location"]').value : '',
            storageCapacity: form.querySelector('input[name="storage-capacity"]').value,
            storageAdequate: form.querySelector('input[name="storage-adequate"]:checked').value
        };
    }
    
    // Add to saved reports
    savedReports.push(report);
    
    // Save to localStorage
    localStorage.setItem('securityReports', JSON.stringify(savedReports));
    
    // Update dashboard
    updateDashboard();
    
    // Reset form
    form.reset();
    initializeForms();
    
    // Hide conditional fields
    toggleConditionalField('fire-alarm-details', false);
    toggleConditionalField('reported-items-details', false);
    toggleConditionalField('camera-issues', false);
    toggleConditionalField('incident-details', false);
    
    // Reset report type fields
    toggleReportTypeFields('security');
    
    // Show success message
    alert(currentLanguage === 'en' ? 'Report saved successfully!' : 'تم حفظ التقرير بنجاح!');
}

// Save inspection checklist
function saveInspection() {
    const form = document.getElementById('inspection-form');
    
    const checklistItems = [];
    for (let i = 1; i <= 12; i++) {
        const status = form.querySelector(`input[name="item-${i}"]:checked`).value;
        checklistItems.push({
            id: i,
            status: status
        });
    }
    
    const inspection = {
        id: generateId(),
        date: form.querySelector('input[name="date"]').value,
        shift: form.querySelector('select[name="shift"]').value,
        checklistItems: checklistItems,
        additionalFindings: form.querySelector('textarea[name="additional-findings"]').value
    };
    
    // Add to saved inspections
    savedInspections.push(inspection);
    
    // Save to localStorage
    localStorage.setItem('securityInspections', JSON.stringify(savedInspections));
    
    // Update dashboard
    updateDashboard();
    
    // Reset form
    form.reset();
    initializeForms();
    
    // Show success message
    alert(currentLanguage === 'en' ? 'Inspection checklist saved successfully!' : 'تم حفظ قائمة التفتيش بنجاح!');
}

// Update dashboard with saved reports and inspections
function updateDashboard() {
    const reportsContainer = document.getElementById('recent-reports');
    const inspectionsContainer = document.getElementById('recent-inspections');
    
    if (reportsContainer) {
        reportsContainer.innerHTML = '';
        
        // Display most recent reports first (up to 5)
        const recentReports = [...savedReports].reverse().slice(0, 5);
        
        if (recentReports.length === 0) {
            reportsContainer.innerHTML = '<p class="text-muted">' + 
                (currentLanguage === 'en' ? 'No reports yet.' : 'لا توجد تقارير حتى الآن.') + '</p>';
        } else {
            recentReports.forEach(report => {
                const reportElement = document.createElement('div');
                reportElement.className = 'list-item';
                reportElement.innerHTML = `
                    <div class="list-item-header">
                        <span class="date">${report.date}</span>
                        <span class="shift">Shift ${report.shift}</span>
                    </div>
                    <div class="list-item-body">
                        <p><strong>${currentLanguage === 'en' ? 'Type' : 'النوع'}:</strong> ${
                            report.reportType === 'security' ? 
                            (currentLanguage === 'en' ? 'Security Report' : 'تقرير أمني') : 
                            (currentLanguage === 'en' ? 'CCTV Report' : 'تقرير كاميرات المراقبة')
                        }</p>
                        <p><strong>${currentLanguage === 'en' ? 'Officer' : 'الضابط'}:</strong> ${report.securityOfficer}</p>
                    </div>
                    <div class="list-item-footer">
                        <button class="btn btn-sm btn-primary view-report" data-id="${report.id}">
                            ${currentLanguage === 'en' ? 'View' : 'عرض'}
                        </button>
                    </div>
                `;
                reportsContainer.appendChild(reportElement);
            });
            
            // Add event listeners to view buttons
            const viewButtons = document.querySelectorAll('.view-report');
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const reportId = this.getAttribute('data-id');
                    viewReport(reportId);
                });
            });
        }
    }
    
    if (inspectionsContainer) {
        inspectionsContainer.innerHTML = '';
        
        // Display most recent inspections first (up to 5)
        const recentInspections = [...savedInspections].reverse().slice(0, 5);
        
        if (recentInspections.length === 0) {
            inspectionsContainer.innerHTML = '<p class="text-muted">' + 
                (currentLanguage === 'en' ? 'No inspections yet.' : 'لا توجد عمليات تفتيش حتى الآن.') + '</p>';
        } else {
            recentInspections.forEach(inspection => {
                const inspectionElement = document.createElement('div');
                inspectionElement.className = 'list-item';
                inspectionElement.innerHTML = `
                    <div class="list-item-header">
                        <span class="date">${inspection.date}</span>
                        <span class="shift">${getShiftName(inspection.shift)}</span>
                    </div>
                    <div class="list-item-footer">
                        <button class="btn btn-sm btn-primary view-inspection" data-id="${inspection.id}">
                            ${currentLanguage === 'en' ? 'View' : 'عرض'}
                        </button>
                    </div>
                `;
                inspectionsContainer.appendChild(inspectionElement);
            });
            
            // Add event listeners to view buttons
            const viewButtons = document.querySelectorAll('.view-inspection');
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const inspectionId = this.getAttribute('data-id');
                    viewInspection(inspectionId);
                });
            });
        }
    }
}

// View saved report
function viewReport(reportId) {
    const report = savedReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Create modal content based on report type
    let modalContent = '';
    
    if (report.reportType === 'security') {
        // Security Report Modal
        modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${currentLanguage === 'en' ? 'Daily Security Report' : 'تقرير الأمن اليومي'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="report-details">
                    <div class="row">
                        <div class="col-md-4">
                            <p><strong>${currentLanguage === 'en' ? 'Date' : 'التاريخ'}:</strong> ${report.date}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>${currentLanguage === 'en' ? 'Time' : 'الوقت'}:</strong> ${report.time}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>${currentLanguage === 'en' ? 'Shift' : 'الوردية'}:</strong> ${report.shift}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Security Officer' : 'ضابط الأمن'}:</strong> ${report.securityOfficer}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Event Description' : 'وصف الحدث'}:</strong></p>
                            <p>${report.eventDescription || (currentLanguage === 'en' ? 'No events reported.' : 'لم يتم الإبلاغ عن أي أحداث.')}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Fire Alarm Activation' : 'تفعيل إنذار الحريق'}:</strong> 
                               ${report.fireAlarm.occurred ? (currentLanguage === 'en' ? 'Yes' : 'نعم') : (currentLanguage === 'en' ? 'No' : 'لا')}</p>
                            ${report.fireAlarm.occurred ? `
                            <p><strong>${currentLanguage === 'en' ? 'Details' : 'التفاصيل'}:</strong></p>
                            <p>${report.fireAlarm.details}</p>
                            ` : ''}
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Reported Items' : 'العناصر المبلغ عنها'}:</strong> 
                               ${report.reportedItems.received ? (currentLanguage === 'en' ? 'Yes' : 'نعم') : (currentLanguage === 'en' ? 'No' : 'لا')}</p>
                            ${report.reportedItems.received ? `
                            <p><strong>${currentLanguage === 'en' ? 'Item Details' : 'تفاصيل العنصر'}:</strong></p>
                            <p>${report.reportedItems.itemDetails}</p>
                            <p><strong>${currentLanguage === 'en' ? 'Reporter Information' : 'معلومات المبلغ'}:</strong></p>
                            <p>${report.reportedItems.reporterInfo}</p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    ${currentLanguage === 'en' ? 'Close' : 'إغلاق'}
                </button>
                <button type="button" class="btn btn-primary print-report" data-id="${report.id}">
                    ${currentLanguage === 'en' ? 'Print' : 'طباعة'}
                </button>
                <button type="button" class="btn btn-success download-pdf-report" data-id="${report.id}">
                    ${currentLanguage === 'en' ? 'Download PDF' : 'تنزيل PDF'}
                </button>
            </div>
        `;
    } else {
        // CCTV Report Modal
        modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${currentLanguage === 'en' ? 'Daily CCTV Report' : 'تقرير كاميرات المراقبة اليومي'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="report-details">
                    <div class="row">
                        <div class="col-md-4">
                            <p><strong>${currentLanguage === 'en' ? 'Date' : 'التاريخ'}:</strong> ${report.date}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>${currentLanguage === 'en' ? 'Time' : 'الوقت'}:</strong> ${report.time}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>${currentLanguage === 'en' ? 'Shift' : 'الوردية'}:</strong> ${report.shift}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Security Officer' : 'ضابط الأمن'}:</strong> ${report.securityOfficer}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Camera Status' : 'حالة الكاميرات'}:</strong> 
                               ${report.camerasFunctioning === 'yes' ? 
                                 (currentLanguage === 'en' ? 'All cameras functioning properly' : 'جميع الكاميرات تعمل بشكل صحيح') : 
                                 (currentLanguage === 'en' ? 'Issues reported' : 'تم الإبلاغ عن مشاكل')}</p>
                            ${report.camerasFunctioning === 'no' ? `
                            <p><strong>${currentLanguage === 'en' ? 'Camera Issues' : 'مشاكل الكاميرات'}:</strong></p>
                            <p>${report.cameraIssues}</p>
                            ` : ''}
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Footage Reviewed' : 'التسجيلات التي تمت مراجعتها'}:</strong> ${report.footageReviewed}</p>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Incidents Observed' : 'الحوادث الملاحظة'}:</strong> 
                               ${report.incidentsObserved === 'yes' ? (currentLanguage === 'en' ? 'Yes' : 'نعم') : (currentLanguage === 'en' ? 'No' : 'لا')}</p>
                            ${report.incidentsObserved === 'yes' ? `
                            <p><strong>${currentLanguage === 'en' ? 'Incident Details' : 'تفاصيل الحادث'}:</strong></p>
                            <p>${report.incidentDetails}</p>
                            <p><strong>${currentLanguage === 'en' ? 'Footage Saved' : 'تم حفظ التسجيل'}:</strong> 
                               ${report.footageSaved === 'yes' ? (currentLanguage === 'en' ? 'Yes' : 'نعم') : (currentLanguage === 'en' ? 'No' : 'لا')}</p>
                            ${report.footageSaved === 'yes' ? `
                            <p><strong>${currentLanguage === 'en' ? 'Footage Location' : 'موقع حفظ التسجيل'}:</strong> ${report.footageLocation}</p>
                            ` : ''}
                            ` : ''}
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <p><strong>${currentLanguage === 'en' ? 'Storage Capacity' : 'سعة التخزين'}:</strong> ${report.storageCapacity}</p>
                            <p><strong>${currentLanguage === 'en' ? 'Storage Adequate' : 'سعة التخزين كافية'}:</strong> 
                               ${report.storageAdequate === 'yes' ? (currentLanguage === 'en' ? 'Yes' : 'نعم') : (currentLanguage === 'en' ? 'No' : 'لا')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    ${currentLanguage === 'en' ? 'Close' : 'إغلاق'}
                </button>
                <button type="button" class="btn btn-primary print-report" data-id="${report.id}">
                    ${currentLanguage === 'en' ? 'Print' : 'طباعة'}
                </button>
                <button type="button" class="btn btn-success download-pdf-report" data-id="${report.id}">
                    ${currentLanguage === 'en' ? 'Download PDF' : 'تنزيل PDF'}
                </button>
            </div>
        `;
    }
    
    // Show modal
    showModal(modalContent);
    
    // Add print event listener
    document.querySelector('.print-report').addEventListener('click', function() {
        printReport(reportId);
    });
}

// View saved inspection
function viewInspection(inspectionId) {
    const inspection = savedInspections.find(i => i.id === inspectionId);
    if (!inspection) return;
    
    // Create table rows for checklist items
    let checklistRows = '';
    const checklistItems = [
        { en: 'Staff are wearing ID badges', ar: 'طاقم العمل يقومون بلبس بطاقات التعريف' },
        { en: 'Basements (B1/B2) are secured', ar: 'المواقف السفلية (B1/B2) أمنة' },
        { en: 'Server room is secured', ar: 'غرفة الخادم (Server) مقفلة' },
        { en: 'CCTV cameras are not obstructed', ar: 'لا يتم إعاقة كاميرات الـمراقبة (CCTV)' },
        { en: 'Roof-top door is secured', ar: 'باب سطح مغلق وآمنة' },
        { en: 'No smoking activity on the roof-top', ar: 'لا وجود لأنشطة التدخين على السطح' },
        { en: 'Emergency exit doors are secured', ar: 'أبواب مخارج الطوارئ مغلقة وآمنة' },
        { en: 'Emergency exits are not obstructed inside/outside', ar: 'مخارج الطوارئ لا يتم إعاقتها سواء من الداخل / الخارج' },
        { en: 'Handicap parking are not used by cars without handicap sticker', ar: 'لا يتم استخدام مواقف ذوي الاحتياجات الخاصة من قبل أشخاص غير ذوي الاحتياجات الخاصة' },
        { en: 'No packages left unattended around the center', ar: 'وجود علب / أكياس دون رقابة حول المركز' },
        { en: 'Sidewalks are clear of obstructions', ar: 'الأرصفة حول المركز خالية من العوائق' },
        { en: 'No smoking activities around the center', ar: 'لايوجد أنشطة تدخين في جميع أنحاء المركز' }
    ];
    
    for (let i = 0; i < inspection.checklistItems.length; i++) {
        const item = inspection.checklistItems[i];
        const itemText = currentLanguage === 'en' ? checklistItems[i].en : checklistItems[i].ar;
        const statusText = getStatusText(item.status);
        
        checklistRows += `
            <tr>
                <td>${i + 1}</td>
                <td>${itemText}</td>
                <td>${statusText}</td>
            </tr>
        `;
    }
    
    // Create modal content
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">${currentLanguage === 'en' ? 'Security Inspection Checklist' : 'قائمة فحص التفتيش الأمني'}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="inspection-details">
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>${currentLanguage === 'en' ? 'Date' : 'التاريخ'}:</strong> ${inspection.date}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>${currentLanguage === 'en' ? 'Shift' : 'الوردية'}:</strong> ${getShiftName(inspection.shift)}</p>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th width="5%">#</th>
                                    <th>${currentLanguage === 'en' ? 'Item' : 'البند'}</th>
                                    <th width="15%">${currentLanguage === 'en' ? 'Status' : 'الحالة'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${checklistRows}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <p><strong>${currentLanguage === 'en' ? 'Additional Findings' : 'ملاحظات أخرى'}:</strong></p>
                        <p>${inspection.additionalFindings || (currentLanguage === 'en' ? 'No additional findings.' : 'لا توجد ملاحظات إضافية.')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                ${currentLanguage === 'en' ? 'Close' : 'إغلاق'}
            </button>
            <button type="button" class="btn btn-primary print-inspection" data-id="${inspection.id}">
                ${currentLanguage === 'en' ? 'Print' : 'طباعة'}
            </button>
            <button type="button" class="btn btn-success download-pdf-inspection" data-id="${inspection.id}">
                ${currentLanguage === 'en' ? 'Download PDF' : 'تنزيل PDF'}
            </button>
        </div>
    `;
    
    // Show modal
    showModal(modalContent);
    
    // Add print event listener
    document.querySelector('.print-inspection').addEventListener('click', function() {
        printInspection(inspectionId);
    });
}

// Show modal with dynamic content
function showModal(content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('dynamic-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'dynamic-modal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content" id="dynamic-modal-content">
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // Set modal content
    document.getElementById('dynamic-modal-content').innerHTML = content;
    
    // Initialize and show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// Print report
function printReport(reportId) {
    const report = savedReports.find(r => r.id === reportId);
    if (!report) return;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    
    // Create print content based on report type
    let printContent = '';
    
    if (report.reportType === 'security') {
        // Security Report Print Content
        printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daily Security Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .row {
                        display: flex;
                        margin-bottom: 10px;
                    }
                    .col {
                        flex: 1;
                    }
                    .label {
                        font-weight: bold;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Daily Security Report</h1>
                </div>
                
                <div class="section">
                    <div class="row">
                        <div class="col">
                            <span class="label">Date:</span> ${report.date}
                        </div>
                        <div class="col">
                            <span class="label">Time:</span> ${report.time}
                        </div>
                        <div class="col">
                            <span class="label">Shift:</span> ${report.shift}
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="label">Security Officer:</div>
                    <div>${report.securityOfficer}</div>
                </div>
                
                <div class="section">
                    <div class="label">Event Description:</div>
                    <div>${report.eventDescription || 'No events reported.'}</div>
                </div>
                
                <div class="section">
                    <div class="label">Fire Alarm Activation:</div>
                    <div>${report.fireAlarm.occurred ? 'Yes' : 'No'}</div>
                    ${report.fireAlarm.occurred ? `
                    <div class="label">Details:</div>
                    <div>${report.fireAlarm.details}</div>
                    ` : ''}
                </div>
                
                <div class="section">
                    <div class="label">Reported Items:</div>
                    <div>${report.reportedItems.received ? 'Yes' : 'No'}</div>
                    ${report.reportedItems.received ? `
                    <div class="label">Item Details:</div>
                    <div>${report.reportedItems.itemDetails}</div>
                    <div class="label">Reporter Information:</div>
                    <div>${report.reportedItems.reporterInfo}</div>
                    ` : ''}
                </div>
                
                <div class="section" style="margin-top: 50px;">
                    <div class="row">
                        <div class="col">
                            <div class="label">Signature:</div>
                            <div style="margin-top: 30px; border-top: 1px solid #333; width: 200px;"></div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    } else {
        // CCTV Report Print Content
        printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Daily CCTV Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                    }
                    .section {
                        margin-bottom: 20px;
                    }
                    .row {
                        display: flex;
                        margin-bottom: 10px;
                    }
                    .col {
                        flex: 1;
                    }
                    .label {
                        font-weight: bold;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 15px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Daily CCTV Report</h1>
                </div>
                
                <div class="section">
                    <div class="row">
                        <div class="col">
                            <span class="label">Date:</span> ${report.date}
                        </div>
                        <div class="col">
                            <span class="label">Time:</span> ${report.time}
                        </div>
                        <div class="col">
                            <span class="label">Shift:</span> ${report.shift}
                        </div>
                    </div>
                </div>
                
                <div class="section">
                    <div class="label">Security Officer:</div>
                    <div>${report.securityOfficer}</div>
                </div>
                
                <div class="section">
                    <div class="label">Camera Status:</div>
                    <div>${report.camerasFunctioning === 'yes' ? 'All cameras functioning properly' : 'Issues reported'}</div>
                    ${report.camerasFunctioning === 'no' ? `
                    <div class="label">Camera Issues:</div>
                    <div>${report.cameraIssues}</div>
                    ` : ''}
                </div>
                
                <div class="section">
                    <div class="label">Footage Reviewed:</div>
                    <div>${report.footageReviewed}</div>
                </div>
                
                <div class="section">
                    <div class="label">Incidents Observed:</div>
                    <div>${report.incidentsObserved === 'yes' ? 'Yes' : 'No'}</div>
                    ${report.incidentsObserved === 'yes' ? `
                    <div class="label">Incident Details:</div>
                    <div>${report.incidentDetails}</div>
                    <div class="label">Footage Saved:</div>
                    <div>${report.footageSaved === 'yes' ? 'Yes' : 'No'}</div>
                    ${report.footageSaved === 'yes' ? `
                    <div class="label">Footage Location:</div>
                    <div>${report.footageLocation}</div>
                    ` : ''}
                    ` : ''}
                </div>
                
                <div class="section">
                    <div class="label">Storage Capacity:</div>
                    <div>${report.storageCapacity}</div>
                    <div class="label">Storage Adequate:</div>
                    <div>${report.storageAdequate === 'yes' ? 'Yes' : 'No'}</div>
                </div>
                
                <div class="section" style="margin-top: 50px;">
                    <div class="row">
                        <div class="col">
                            <div class="label">Signature:</div>
                            <div style="margin-top: 30px; border-top: 1px solid #333; width: 200px;"></div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
    
    // Print and close
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Print inspection
function printInspection(inspectionId) {
    const inspection = savedInspections.find(i => i.id === inspectionId);
    if (!inspection) return;
    
    // Create checklist items rows
    let checklistRows = '';
    const checklistItems = [
        { en: 'Staff are wearing ID badges', ar: 'طاقم العمل يقومون بلبس بطاقات التعريف' },
        { en: 'Basements (B1/B2) are secured', ar: 'المواقف السفلية (B1/B2) أمنة' },
        { en: 'Server room is secured', ar: 'غرفة الخادم (Server) مقفلة' },
        { en: 'CCTV cameras are not obstructed', ar: 'لا يتم إعاقة كاميرات الـمراقبة (CCTV)' },
        { en: 'Roof-top door is secured', ar: 'باب سطح مغلق وآمنة' },
        { en: 'No smoking activity on the roof-top', ar: 'لا وجود لأنشطة التدخين على السطح' },
        { en: 'Emergency exit doors are secured', ar: 'أبواب مخارج الطوارئ مغلقة وآمنة' },
        { en: 'Emergency exits are not obstructed inside/outside', ar: 'مخارج الطوارئ لا يتم إعاقتها سواء من الداخل / الخارج' },
        { en: 'Handicap parking are not used by cars without handicap sticker', ar: 'لا يتم استخدام مواقف ذوي الاحتياجات الخاصة من قبل أشخاص غير ذوي الاحتياجات الخاصة' },
        { en: 'No packages left unattended around the center', ar: 'وجود علب / أكياس دون رقابة حول المركز' },
        { en: 'Sidewalks are clear of obstructions', ar: 'الأرصفة حول المركز خالية من العوائق' },
        { en: 'No smoking activities around the center', ar: 'لايوجد أنشطة تدخين في جميع أنحاء المركز' }
    ];
    
    for (let i = 0; i < inspection.checklistItems.length; i++) {
        const item = inspection.checklistItems[i];
        checklistRows += `
            <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td>${checklistItems[i].en}</td>
                <td style="text-align: center;">${item.status}</td>
                <td>${checklistItems[i].ar}</td>
                <td style="text-align: center;">${i + 1}</td>
            </tr>
        `;
    }
    
    // Create print window
    const printWindow = window.open('', '_blank');
    
    // Create print content
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Security Inspection Checklist</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    margin: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 10px;
                }
                .section {
                    margin-bottom: 20px;
                }
                .row {
                    display: flex;
                    margin-bottom: 10px;
                }
                .col {
                    flex: 1;
                }
                .label {
                    font-weight: bold;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #333;
                    padding: 8px;
                }
                th {
                    background-color: #f2f2f2;
                }
                .arabic {
                    text-align: right;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Security Inspection Checklist / قائمة فحص التفتيش الأمني</h1>
            </div>
            
            <div class="section">
                <div class="row">
                    <div class="col">
                        <span class="label">Date / التاريخ:</span> ${inspection.date}
                    </div>
                    <div class="col">
                        <span class="label">Shift / الوردية:</span> ${getShiftName(inspection.shift)} / ${getShiftNameArabic(inspection.shift)}
                    </div>
                </div>
            </div>
            
            <div class="section">
                <table>
                    <thead>
                        <tr>
                            <th width="5%">#</th>
                            <th>Item</th>
                            <th width="10%">Y/N/NA</th>
                            <th class="arabic">البند</th>
                            <th width="5%">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${checklistRows}
                    </tbody>
                </table>
            </div>
            
            <div class="section">
                <div class="label">Other findings / ملاحظات أخرى:</div>
                <div style="min-height: 100px; border: 1px solid #333; padding: 10px;">
                    ${inspection.additionalFindings || ''}
                </div>
            </div>
            
            <div class="section" style="margin-top: 50px;">
                <div class="row">
                    <div class="col">
                        <div class="label">Signature / التوقيع:</div>
                        <div style="margin-top: 30px; border-top: 1px solid #333; width: 200px;"></div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    
    // Print and close
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Set language for the application
function setLanguage(lang) {
    const body = document.body;
    
    if (lang === 'ar') {
        body.classList.add('rtl');
        body.dir = 'rtl';
    } else {
        body.classList.remove('rtl');
        body.dir = 'ltr';
    }
    
    // Update all language-specific elements
    const elements = document.querySelectorAll('[data-lang-en], [data-lang-ar]');
    elements.forEach(element => {
        element.textContent = element.getAttribute(`data-lang-${lang}`);
    });
    
    // Update placeholders
    const inputs = document.querySelectorAll('[data-placeholder-en], [data-placeholder-ar]');
    inputs.forEach(input => {
        input.placeholder = input.getAttribute(`data-placeholder-${lang}`);
    });
}

// Helper function to get shift name
function getShiftName(shift) {
    if (shift === '1st') return '1st';
    if (shift === '2nd') return '2nd';
    if (shift === '3rd') return '3rd';
    return shift; // A, B, C for daily report
}

// Helper function to get shift name in Arabic
function getShiftNameArabic(shift) {
    if (shift === '1st') return 'الاولى';
    if (shift === '2nd') return 'الثانية';
    if (shift === '3rd') return 'الثالثة';
    return shift; // A, B, C for daily report
}

// Helper function to get status text
function getStatusText(status) {
    if (currentLanguage === 'en') {
        if (status === 'Y') return 'Yes';
        if (status === 'N') return 'No';
        if (status === 'NA') return 'Not Applicable';
    } else {
        if (status === 'Y') return 'نعم';
        if (status === 'N') return 'لا';
        if (status === 'NA') return 'لاينطبق';
    }
    return status;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
