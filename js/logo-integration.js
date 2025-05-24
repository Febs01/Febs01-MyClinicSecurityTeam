// Logo Integration for Security Department Management System

// Initialize logo functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add logo to header
    addLogoToHeader();
    
    // Load logo for PDF export
    loadLogoForPdf();
});

// Add logo to the header of the application
function addLogoToHeader() {
    const headerContainer = document.querySelector('header .container');
    if (!headerContainer) return;
    
    // Create logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';
    
    // Create logo image
    const logoImg = document.createElement('img');
    logoImg.src = 'assets/company_logo.jpg';
    logoImg.alt = 'My Clinic Logo';
    logoImg.className = 'company-logo';
    
    // Add logo to container
    logoContainer.appendChild(logoImg);
    
    // Insert logo at the beginning of the header container
    headerContainer.insertBefore(logoContainer, headerContainer.firstChild);
}

// Load logo for PDF export
function loadLogoForPdf() {
    const img = new Image();
    img.onload = function() {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to data URL
        try {
            const dataUrl = canvas.toDataURL('image/png');
            window.companyLogoDataUrl = dataUrl;
            console.log('Logo loaded successfully for PDF export');
        } catch (error) {
            console.error('Error converting logo to data URL:', error);
        }
    };
    
    img.onerror = function() {
        console.error('Error loading logo image');
    };
    
    // Set the source of the image
    img.src = 'assets/company_logo.jpg';
}
