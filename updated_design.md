# Updated Application Design Document

## Architecture Overview
The Security Department Management System will be enhanced with authentication, report type selection, and PDF generation capabilities while maintaining its web-based architecture using HTML, CSS, and JavaScript.

## Updated Technology Stack
- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Storage: Local browser storage (localStorage) for standalone operation
- PDF Generation: jsPDF library for client-side PDF creation
- Authentication: Client-side authentication with localStorage

## Updated Application Structure
```
security_management_system/
├── index.html              # Login page (new)
├── dashboard.html          # Main application (renamed from index.html)
├── css/
│   ├── styles.css          # Main stylesheet (updated)
│   ├── login.css           # Login page styles (new)
│   └── bootstrap.min.css   # Bootstrap framework
├── js/
│   ├── app.js              # Main application logic (updated)
│   ├── auth.js             # Authentication logic (new)
│   ├── daily-report.js     # Daily report functionality (updated)
│   ├── inspection.js       # Inspection checklist functionality
│   ├── storage.js          # Data storage and retrieval (updated)
│   ├── pdf-export.js       # PDF generation (new)
│   └── bootstrap.min.js    # Bootstrap framework
├── lib/
│   └── jspdf.min.js        # PDF generation library (new)
├── fonts/                  # Custom fonts for Arabic support
└── assets/                 # Images and other assets
```

## Authentication System Design

### User Model
```json
{
  "username": "string",
  "password": "string (hashed)",
  "fullName": "string",
  "role": "string (admin/user)"
}
```

### Authentication Flow
1. User navigates to index.html (login page)
2. User enters credentials
3. Client-side validation checks credentials against stored users
4. If valid, create session and redirect to dashboard.html
5. If invalid, show error message
6. Session check on each page load to prevent unauthorized access

### Session Management
- Store session token in localStorage
- Include timeout mechanism for automatic logout after inactivity
- Provide logout functionality

## Updated Data Models

### Daily Report (Updated)
```json
{
  "id": "unique-id",
  "reportType": "Security/CCTV",
  "date": "2025-05-20",
  "time": "08:00",
  "shift": "A",
  "securityOfficer": "Officer Name",
  "eventDescription": "Description text...",
  "fireAlarm": {
    "occurred": true/false,
    "details": "Details if occurred..."
  },
  "reportedItems": {
    "received": true/false,
    "itemDetails": "Item details if received...",
    "reporterInfo": "Reporter information if received..."
  }
}
```

### User Interface Updates

#### Login Page
- Username and password fields
- Login button
- Error message display area
- Language toggle

#### Daily Report Form Updates
- Report type selection (Security/CCTV) at the top of the form
- Conditional fields based on report type selection
- PDF download button added to report view

## PDF Generation Design
- Use jsPDF library for client-side PDF generation
- Create templates for different report types
- Support for bilingual content
- Include all report data in structured format
- Add company logo/header to PDF reports
- Include timestamp and page numbers

### PDF Generation Process
1. User views a report and clicks "Download PDF"
2. Application retrieves report data from storage
3. PDF template is populated with report data
4. jsPDF generates the PDF document
5. Browser initiates download of the generated PDF

## Bilingual Support Implementation (Updated)
- All new UI elements will have both English and Arabic text
- PDF reports will include bilingual headers and content
- Right-to-left (RTL) layout support maintained throughout

## Data Storage Strategy (Updated)
- Add users collection to localStorage
- Update reports collection schema to include report type
- Maintain backward compatibility with existing data
- Add session storage for authentication state
