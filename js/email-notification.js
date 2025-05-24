// Updated Email Notification Integration for Security Department Management System

// Initialize email notification functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up email notification for form submissions
    setupEmailNotifications();
});

// Set up email notifications for report and inspection submissions
function setupEmailNotifications() {
    // Add event listeners to report form submission
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', function(e) {
            // The original form submission is handled in app.js
            // We'll hook into the existing functionality to add email notification
            setTimeout(() => {
                const reportId = localStorage.getItem('lastSubmittedReportId');
                if (reportId) {
                    sendReportByEmail(reportId);
                }
            }, 1000); // Small delay to ensure the report is saved first
        });
    }
    
    // Add event listeners to inspection form submission
    const inspectionForm = document.getElementById('inspection-form');
    if (inspectionForm) {
        inspectionForm.addEventListener('submit', function(e) {
            // The original form submission is handled in app.js
            // We'll hook into the existing functionality to add email notification
            setTimeout(() => {
                const inspectionId = localStorage.getItem('lastSubmittedInspectionId');
                if (inspectionId) {
                    sendInspectionByEmail(inspectionId);
                }
            }, 1000); // Small delay to ensure the inspection is saved first
        });
    }
}

// Send report by email
function sendReportByEmail(reportId) {
    try {
        // Get the report from local storage
        const savedReportsStr = localStorage.getItem('savedReports');
        if (!savedReportsStr) {
            console.error('No saved reports found in local storage');
            showNotification('Error: Could not find saved reports', 'error');
            return;
        }
        
        const savedReports = JSON.parse(savedReportsStr);
        const report = savedReports.find(r => r.id === reportId);
        
        if (!report) {
            console.error('Report not found:', reportId);
            showNotification('Error: Could not find the submitted report', 'error');
            return;
        }
        
        // Generate PDF for email attachment
        generateReportPdfForEmail(report);
    } catch (error) {
        console.error('Error sending report by email:', error);
        showNotification('Error sending email notification. Please try again.', 'error');
    }
}

// Send inspection by email
function sendInspectionByEmail(inspectionId) {
    try {
        // Get the inspection from local storage
        const savedInspectionsStr = localStorage.getItem('savedInspections');
        if (!savedInspectionsStr) {
            console.error('No saved inspections found in local storage');
            showNotification('Error: Could not find saved inspections', 'error');
            return;
        }
        
        const savedInspections = JSON.parse(savedInspectionsStr);
        const inspection = savedInspections.find(i => i.id === inspectionId);
        
        if (!inspection) {
            console.error('Inspection not found:', inspectionId);
            showNotification('Error: Could not find the submitted inspection', 'error');
            return;
        }
        
        // Generate PDF for email attachment
        generateInspectionPdfForEmail(inspection);
    } catch (error) {
        console.error('Error sending inspection by email:', error);
        showNotification('Error sending email notification. Please try again.', 'error');
    }
}

// Generate PDF for a report and send by email
function generateReportPdfForEmail(report) {
    try {
        // Create new jsPDF instance
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded properly');
            showNotification('Error generating PDF for email. Please try again.', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set font size and line height
        const fontSize = 10;
        const lineHeight = 7;
        let y = 20; // Starting y position
        
        // Add company logo if available
        if (window.companyLogoDataUrl) {
            try {
                doc.addImage(window.companyLogoDataUrl, 'PNG', 20, y, 40, 15);
                y += 20; // Adjust y position after logo
            } catch (logoError) {
                console.warn('Could not add logo to PDF:', logoError);
                // Continue without logo if there's an error
            }
        }
        
        // Add header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        
        // Add title based on report type
        let title = '';
        if (report.reportType === 'security') {
            title = currentLanguage === 'en' ? 'DAILY SECURITY REPORT' : 'تقرير الأمن اليومي';
        } else {
            title = currentLanguage === 'en' ? 'DAILY CCTV REPORT' : 'تقرير كاميرات المراقبة اليومي';
        }
        
        // Center the title
        const titleWidth = doc.getStringUnitWidth(title) * 16 / doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(title, (pageWidth - titleWidth) / 2, y);
        y += 10;
        
        // Add horizontal line
        doc.setLineWidth(0.5);
        doc.line(20, y, pageWidth - 20, y);
        y += 10;
        
        // Reset font for body text
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'normal');
        
        // Add report information
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Date:' : 'التاريخ:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(report.date, 50, y);
        
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Time:' : 'الوقت:', 100, y);
        doc.setFont('helvetica', 'normal');
        doc.text(report.time, 130, y);
        y += lineHeight;
        
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Shift:' : 'الوردية:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(report.shift, 50, y);
        y += lineHeight * 2;
        
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Security Officer:' : 'ضابط الأمن:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(report.securityOfficer, 70, y);
        y += lineHeight * 2;
        
        // Add report content based on report type
        if (report.reportType === 'security') {
            // Security Report specific fields
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Event Description:' : 'وصف الحدث:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            const eventDescription = report.eventDescription || (currentLanguage === 'en' ? 'No events reported.' : 'لم يتم الإبلاغ عن أي أحداث.');
            const eventDescriptionLines = doc.splitTextToSize(eventDescription, pageWidth - 40);
            doc.text(eventDescriptionLines, 20, y);
            y += lineHeight * (eventDescriptionLines.length + 1);
            
            // Fire Alarm section
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Fire Alarm Activation:' : 'تفعيل إنذار الحريق:', 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(report.fireAlarm.occurred ? 
                (currentLanguage === 'en' ? 'Yes' : 'نعم') : 
                (currentLanguage === 'en' ? 'No' : 'لا'), 
                100, y);
            y += lineHeight;
            
            if (report.fireAlarm.occurred) {
                doc.setFont('helvetica', 'bold');
                doc.text(currentLanguage === 'en' ? 'Details:' : 'التفاصيل:', 20, y);
                y += lineHeight;
                
                doc.setFont('helvetica', 'normal');
                const fireAlarmLines = doc.splitTextToSize(report.fireAlarm.details, pageWidth - 40);
                doc.text(fireAlarmLines, 20, y);
                y += lineHeight * (fireAlarmLines.length + 1);
            }
            
            // Reported Items section
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Reported Items:' : 'العناصر المبلغ عنها:', 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(report.reportedItems.received ? 
                (currentLanguage === 'en' ? 'Yes' : 'نعم') : 
                (currentLanguage === 'en' ? 'No' : 'لا'), 
                100, y);
            y += lineHeight;
            
            if (report.reportedItems.received) {
                doc.setFont('helvetica', 'bold');
                doc.text(currentLanguage === 'en' ? 'Item Details:' : 'تفاصيل العنصر:', 20, y);
                y += lineHeight;
                
                doc.setFont('helvetica', 'normal');
                const itemDetailsLines = doc.splitTextToSize(report.reportedItems.itemDetails, pageWidth - 40);
                doc.text(itemDetailsLines, 20, y);
                y += lineHeight * (itemDetailsLines.length + 1);
                
                doc.setFont('helvetica', 'bold');
                doc.text(currentLanguage === 'en' ? 'Reporter Information:' : 'معلومات المبلغ:', 20, y);
                y += lineHeight;
                
                doc.setFont('helvetica', 'normal');
                const reporterInfoLines = doc.splitTextToSize(report.reportedItems.reporterInfo, pageWidth - 40);
                doc.text(reporterInfoLines, 20, y);
                y += lineHeight * (reporterInfoLines.length + 1);
            }
        } else {
            // CCTV Report specific fields
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Camera Status:' : 'حالة الكاميرات:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            const cameraStatus = report.cameraStatus || (currentLanguage === 'en' ? 'No status reported.' : 'لم يتم الإبلاغ عن أي حالة.');
            const cameraStatusLines = doc.splitTextToSize(cameraStatus, pageWidth - 40);
            doc.text(cameraStatusLines, 20, y);
            y += lineHeight * (cameraStatusLines.length + 1);
            
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Footage Review:' : 'مراجعة التسجيلات:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            const footageReview = report.footageReview || (currentLanguage === 'en' ? 'No review reported.' : 'لم يتم الإبلاغ عن أي مراجعة.');
            const footageReviewLines = doc.splitTextToSize(footageReview, pageWidth - 40);
            doc.text(footageReviewLines, 20, y);
            y += lineHeight * (footageReviewLines.length + 1);
            
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Incidents Observed:' : 'الحوادث المرصودة:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            const incidents = report.incidents || (currentLanguage === 'en' ? 'No incidents reported.' : 'لم يتم الإبلاغ عن أي حوادث.');
            const incidentsLines = doc.splitTextToSize(incidents, pageWidth - 40);
            doc.text(incidentsLines, 20, y);
            y += lineHeight * (incidentsLines.length + 1);
            
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Storage Status:' : 'حالة التخزين:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            const storageStatus = report.storageStatus || (currentLanguage === 'en' ? 'No storage status reported.' : 'لم يتم الإبلاغ عن حالة التخزين.');
            const storageStatusLines = doc.splitTextToSize(storageStatus, pageWidth - 40);
            doc.text(storageStatusLines, 20, y);
            y += lineHeight * (storageStatusLines.length + 1);
        }
        
        // Add signature line at the bottom
        y = doc.internal.pageSize.getHeight() - 30;
        doc.setLineWidth(0.5);
        doc.line(20, y, 80, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(currentLanguage === 'en' ? 'Signature' : 'التوقيع', 20, y + 5);
        
        // Add date and time of PDF generation
        const now = new Date();
        const dateTimeStr = now.toLocaleString();
        doc.text(currentLanguage === 'en' ? 'Generated on: ' : 'تم إنشاؤه في: ' + dateTimeStr, 20, doc.internal.pageSize.getHeight() - 10);
        
        // Add page number
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(currentLanguage === 'en' ? 'Page 1 of 1' : 'صفحة 1 من 1', pageWidth - 40, doc.internal.pageSize.getHeight() - 10);
        
        // Get PDF as base64 string
        const pdfData = doc.output('datauristring');
        const base64Data = pdfData.split(',')[1];
        
        // Prepare email data
        const reportType = report.reportType === 'security' ? 'Security' : 'CCTV';
        const emailSubject = `${reportType} Report - ${report.date}`;
        const emailMessage = `
            A new ${reportType.toLowerCase()} report has been submitted.
            
            Date: ${report.date}
            Time: ${report.time}
            Shift: ${report.shift}
            Security Officer: ${report.securityOfficer}
            
            This is an automated notification from the Security Department Management System.
        `;
        
        const fileName = `${report.reportType}_report_${report.date.replace(/-/g, '')}_${report.id}.pdf`;
        
        // Send email with PDF attachment
        sendEmailWithAttachment(emailSubject, emailMessage, base64Data, fileName);
        
    } catch (error) {
        console.error('Error generating PDF for email:', error);
        showNotification('Error generating PDF for email. Please try again.', 'error');
    }
}

// Generate PDF for an inspection and send by email
function generateInspectionPdfForEmail(inspection) {
    try {
        // Create new jsPDF instance
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded properly');
            showNotification('Error generating PDF for email. Please try again.', 'error');
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        // Set font size and line height
        const fontSize = 10;
        const lineHeight = 7;
        let y = 20; // Starting y position
        
        // Add company logo if available
        if (window.companyLogoDataUrl) {
            try {
                doc.addImage(window.companyLogoDataUrl, 'PNG', 20, y, 40, 15);
                y += 20; // Adjust y position after logo
            } catch (logoError) {
                console.warn('Could not add logo to PDF:', logoError);
                // Continue without logo if there's an error
            }
        }
        
        // Add header
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        
        const title = currentLanguage === 'en' ? 'SECURITY INSPECTION CHECKLIST' : 'قائمة فحص التفتيش الأمني';
        
        // Center the title
        const titleWidth = doc.getStringUnitWidth(title) * 16 / doc.internal.scaleFactor;
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(title, (pageWidth - titleWidth) / 2, y);
        y += 10;
        
        // Add horizontal line
        doc.setLineWidth(0.5);
        doc.line(20, y, pageWidth - 20, y);
        y += 10;
        
        // Reset font for body text
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'normal');
        
        // Add inspection information
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Date:' : 'التاريخ:', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(inspection.date, 50, y);
        
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Shift:' : 'الوردية:', 100, y);
        doc.setFont('helvetica', 'normal');
        doc.text(getShiftName(inspection.shift) + (currentLanguage === 'en' ? '' : ' / ' + getShiftNameArabic(inspection.shift)), 130, y);
        y += lineHeight * 2;
        
        // Create checklist table
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
        
        // Add table header
        doc.setFont('helvetica', 'bold');
        doc.text('#', 20, y);
        doc.text(currentLanguage === 'en' ? 'Item' : 'البند', 30, y);
        doc.text('Y/N/NA', pageWidth - 30, y);
        y += lineHeight;
        
        // Add horizontal line
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
        y += lineHeight;
        
        // Add table rows
        for (let i = 0; i < inspection.checklistItems.length; i++) {
            const item = inspection.checklistItems[i];
            const itemText = currentLanguage === 'en' ? checklistItems[i].en : checklistItems[i].ar;
            
            doc.setFont('helvetica', 'normal');
            doc.text((i + 1).toString(), 20, y);
            
            // Split long text to multiple lines if needed
            const itemLines = doc.splitTextToSize(itemText, pageWidth - 70);
            doc.text(itemLines, 30, y);
            
            doc.text(item.status, pageWidth - 30, y);
            
            // Adjust y position based on number of lines in the item text
            y += lineHeight * Math.max(itemLines.length, 1);
            
            // Add a small gap between items
            y += 2;
        }
        
        // Add horizontal line
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
        y += lineHeight * 2;
        
        // Add additional findings
        doc.setFont('helvetica', 'bold');
        doc.text(currentLanguage === 'en' ? 'Additional Findings:' : 'ملاحظات أخرى:', 20, y);
        y += lineHeight;
        
        doc.setFont('helvetica', 'normal');
        const additionalFindings = inspection.additionalFindings || (currentLanguage === 'en' ? 'No additional findings.' : 'لا توجد ملاحظات إضافية.');
        const findingsLines = doc.splitTextToSize(additionalFindings, pageWidth - 40);
        doc.text(findingsLines, 20, y);
        
        // Add signature line at the bottom
        y = doc.internal.pageSize.getHeight() - 30;
        doc.setLineWidth(0.5);
        doc.line(20, y, 80, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(currentLanguage === 'en' ? 'Signature' : 'التوقيع', 20, y + 5);
        
        // Add date and time of PDF generation
        const now = new Date();
        const dateTimeStr = now.toLocaleString();
        doc.text(currentLanguage === 'en' ? 'Generated on: ' : 'تم إنشاؤه في: ' + dateTimeStr, 20, doc.internal.pageSize.getHeight() - 10);
        
        // Add page number
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(currentLanguage === 'en' ? 'Page 1 of 1' : 'صفحة 1 من 1', pageWidth - 40, doc.internal.pageSize.getHeight() - 10);
        
        // Get PDF as base64 string
        const pdfData = doc.output('datauristring');
        const base64Data = pdfData.split(',')[1];
        
        // Prepare email data
        const emailSubject = `Security Inspection Checklist - ${inspection.date}`;
        const emailMessage = `
            A new security inspection checklist has been submitted.
            
            Date: ${inspection.date}
            Shift: ${getShiftName(inspection.shift)}
            
            This is an automated notification from the Security Department Management System.
        `;
        
        const fileName = `inspection_checklist_${inspection.date.replace(/-/g, '')}_${inspection.id}.pdf`;
        
        // Send email with PDF attachment
        sendEmailWithAttachment(emailSubject, emailMessage, base64Data, fileName);
        
    } catch (error) {
        console.error('Error generating PDF for email:', error);
        showNotification('Error generating PDF for email. Please try again.', 'error');
    }
}

// Send email with PDF attachment
function sendEmailWithAttachment(subject, message, pdfData, filename) {
    // Prepare data for API call
    const emailData = {
        subject: subject,
        message: message,
        pdf_data: pdfData,
        filename: filename
    };
    
    // Show sending notification
    showNotification('Sending email notification...', 'info');
    
    // Get the email server URL from configuration or use default
    // In production, this should be a fully qualified domain name, not localhost
    const emailServerUrl = window.emailServerUrl || 'http://localhost:5000';
    
    // Send API request
    fetch(`${emailServerUrl}/send-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification('Email notification sent successfully!', 'success');
            console.log('Email sent successfully:', data);
        } else {
            showNotification(`Error sending email: ${data.error}`, 'error');
            console.error('Email sending error:', data.error);
        }
    })
    .catch(error => {
        showNotification('Error connecting to email server. Please check if the email server is running.', 'error');
        console.error('Email server connection error:', error);
        
        // Log more detailed error information for debugging
        console.error('Email server URL:', emailServerUrl);
        console.error('Email data (without PDF):', {
            subject: emailData.subject,
            message: emailData.message,
            filename: emailData.filename
        });
    });
}

// Show notification to user
function showNotification(message, type) {
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
            notificationContainer.removeChild(notification);
        }, 500);
    }, 5000);
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
