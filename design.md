# Application Design Document

## Architecture Overview
The Security Department Management System will be implemented as a web-based application using HTML, CSS, and JavaScript. This approach provides several advantages:

1. Cross-platform compatibility (works on any device with a web browser)
2. No installation required (can be accessed via browser)
3. Easy to update and maintain
4. Supports bilingual text display
5. Can be deployed locally or on a server

## Technology Stack
- Frontend: HTML5, CSS3, JavaScript, Bootstrap 5
- Storage: Local browser storage (localStorage) for standalone operation
- Export: PDF generation capability for reports

## Application Structure
```
security_management_system/
├── index.html              # Main entry point
├── css/
│   ├── styles.css          # Main stylesheet
│   └── bootstrap.min.css   # Bootstrap framework
├── js/
│   ├── app.js              # Main application logic
│   ├── daily-report.js     # Daily report functionality
│   ├── inspection.js       # Inspection checklist functionality
│   ├── storage.js          # Data storage and retrieval
│   ├── pdf-export.js       # PDF generation
│   └── bootstrap.min.js    # Bootstrap framework
├── fonts/                  # Custom fonts for Arabic support
└── assets/                 # Images and other assets
```

## Data Model

### Daily Report
```json
{
  "id": "unique-id",
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

### Inspection Checklist
```json
{
  "id": "unique-id",
  "date": "2025-05-20",
  "shift": "1st",
  "checklistItems": [
    {
      "id": 1,
      "status": "Y"/"N"/"NA"
    },
    // Items 2-12 follow the same structure
  ],
  "additionalFindings": "Other observations..."
}
```

## User Interface Design

### Main Dashboard
- Navigation tabs for switching between Daily Report and Inspection Checklist
- List of recent reports/checklists
- Create new report/checklist buttons
- Language toggle (English/Arabic)

### Daily Report Form
- Automated fields section (date, time, shift)
- Security officer information section
- Event description text area
- Conditional questions section with dynamic display based on responses
- Submit and Reset buttons

### Inspection Checklist Form
- Bilingual header with date and shift selection
- Table layout for 12 inspection items with Y/N/NA options
- Additional findings text area
- Submit and Reset buttons

## Bilingual Support Implementation
- All UI elements will have both English and Arabic text
- Right-to-left (RTL) layout support for Arabic
- Custom fonts to ensure proper Arabic character display
- Language toggle to switch between languages

## Conditional Logic Implementation
- JavaScript event listeners for Yes/No responses
- Dynamic showing/hiding of additional input fields based on responses
- Form validation to ensure required fields are completed

## Data Storage Strategy
- Use browser's localStorage for data persistence
- Export functionality to save reports as PDF files
- Option to save data as JSON for backup/transfer
