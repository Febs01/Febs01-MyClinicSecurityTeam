// PDF Export Functionality for Security Department Management System

// Initialize PDF functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up PDF download buttons if they exist
    setupPdfButtons();
});

// Set up PDF download buttons
function setupPdfButtons() {
    // Add event listeners to PDF download buttons in report and inspection views
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('download-pdf-report')) {
            const reportId = e.target.getAttribute('data-id');
            generateReportPdf(reportId);
        }
        
        if (e.target && e.target.classList.contains('download-pdf-inspection')) {
            const inspectionId = e.target.getAttribute('data-id');
            generateInspectionPdf(inspectionId);
        }
    });
}

// Generate PDF for a daily report
function generateReportPdf(reportId) {
    try {
        const report = savedReports.find(r => r.id === reportId);
        if (!report) {
            console.error('Report not found:', reportId);
            return;
        }
        
        // Create new jsPDF instance
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded properly');
            alert('PDF generation failed: Library not loaded properly');
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
            doc.setFont('helvetica', 'normal');
            doc.text(report.camerasFunctioning === 'yes' ? 
                (currentLanguage === 'en' ? 'All cameras functioning properly' : 'جميع الكاميرات تعمل بشكل صحيح') : 
                (currentLanguage === 'en' ? 'Issues reported' : 'تم الإبلاغ عن مشاكل'), 
                100, y);
            y += lineHeight;
            
            if (report.camerasFunctioning === 'no') {
                doc.setFont('helvetica', 'bold');
                doc.text(currentLanguage === 'en' ? 'Camera Issues:' : 'مشاكل الكاميرات:', 20, y);
                y += lineHeight;
                
                doc.setFont('helvetica', 'normal');
                const cameraIssuesLines = doc.splitTextToSize(report.cameraIssues, pageWidth - 40);
                doc.text(cameraIssuesLines, 20, y);
                y += lineHeight * (cameraIssuesLines.length + 1);
            }
            
            // Footage Review section
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Footage Reviewed:' : 'التسجيلات التي تمت مراجعتها:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            doc.text(report.footageReviewed, 20, y);
            y += lineHeight * 2;
            
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Incidents Observed:' : 'الحوادث الملاحظة:', 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(report.incidentsObserved === 'yes' ? 
                (currentLanguage === 'en' ? 'Yes' : 'نعم') : 
                (currentLanguage === 'en' ? 'No' : 'لا'), 
                100, y);
            y += lineHeight;
            
            if (report.incidentsObserved === 'yes') {
                doc.setFont('helvetica', 'bold');
                doc.text(currentLanguage === 'en' ? 'Incident Details:' : 'تفاصيل الحادث:', 20, y);
                y += lineHeight;
                
                doc.setFont('helvetica', 'normal');
                const incidentDetailsLines = doc.splitTextToSize(report.incidentDetails, pageWidth - 40);
                doc.text(incidentDetailsLines, 20, y);
                y += lineHeight * (incidentDetailsLines.length + 1);
                
                doc.setFont('helvetica', 'bold');
                doc.text(currentLanguage === 'en' ? 'Footage Saved:' : 'تم حفظ التسجيل:', 20, y);
                doc.setFont('helvetica', 'normal');
                doc.text(report.footageSaved === 'yes' ? 
                    (currentLanguage === 'en' ? 'Yes' : 'نعم') : 
                    (currentLanguage === 'en' ? 'No' : 'لا'), 
                    100, y);
                y += lineHeight;
                
                if (report.footageSaved === 'yes') {
                    doc.setFont('helvetica', 'bold');
                    doc.text(currentLanguage === 'en' ? 'Footage Location:' : 'موقع حفظ التسجيل:', 20, y);
                    y += lineHeight;
                    
                    doc.setFont('helvetica', 'normal');
                    doc.text(report.footageLocation, 20, y);
                    y += lineHeight * 2;
                }
            }
            
            // Storage Status section
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Storage Capacity:' : 'سعة التخزين:', 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'normal');
            doc.text(report.storageCapacity, 20, y);
            y += lineHeight;
            
            doc.setFont('helvetica', 'bold');
            doc.text(currentLanguage === 'en' ? 'Storage Adequate:' : 'سعة التخزين كافية:', 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(report.storageAdequate === 'yes' ? 
                (currentLanguage === 'en' ? 'Yes' : 'نعم') : 
                (currentLanguage === 'en' ? 'No' : 'لا'), 
                100, y);
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
        
        // Save the PDF with a try-catch block to catch any errors
        try {
            const fileName = `${report.reportType}_report_${report.date.replace(/-/g, '')}_${report.id}.pdf`;
            doc.save(fileName);
            console.log('PDF saved successfully:', fileName);
        } catch (saveError) {
            console.error('Error saving PDF:', saveError);
            alert('Error saving PDF. Please try again or check browser settings.');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Generate PDF for an inspection checklist
function generateInspectionPdf(inspectionId) {
    try {
        const inspection = savedInspections.find(i => i.id === inspectionId);
        if (!inspection) {
            console.error('Inspection not found:', inspectionId);
            return;
        }
        
        // Create new jsPDF instance
        if (!window.jspdf || !window.jspdf.jsPDF) {
            console.error('jsPDF library not loaded properly');
            alert('PDF generation failed: Library not loaded properly');
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
        
        // Save the PDF with a try-catch block to catch any errors
        try {
            const fileName = `inspection_checklist_${inspection.date.replace(/-/g, '')}_${inspection.id}.pdf`;
            doc.save(fileName);
            console.log('PDF saved successfully:', fileName);
        } catch (saveError) {
            console.error('Error saving PDF:', saveError);
            alert('Error saving PDF. Please try again or check browser settings.');
        }
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
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
