# Security Department Management System Requirements

## 1. Daily Security Report Requirements

### Automated Fields
- Date (automatically generated)
- Time (automatically generated)
- Shift (A, B, C) (automatically selected)

### User Input Fields
- Security Officer Name (text field)
- Event Description (text area for detailed descriptions)

### Conditional Questions
1. Fire Alarm Question
   - Question: "Did the fire alarm go on today?" (Yes/No)
   - If Yes: Display additional text area for detailed description
   - If No: Proceed to next question

2. Reported Items Question
   - Question: "Have you received reported items?" (Yes/No)
   - If Yes: Display fields for:
     - Item details (text area)
     - Reporter information (text fields)
   - If No: Proceed to next section

## 2. Security Inspection Checklist Requirements

### Header Information
- Date (automatically generated)
- Shift (selection: 1st/2nd/3rd) with bilingual labels (English/Arabic)

### Inspection Items
- 12 specific inspection items in both English and Arabic
- Each item has three possible responses: Yes (Y/نعم), No (N/لا), Not Applicable (NA/لاينطبق)

### Additional Section
- "Other findings" / "ملاحظات أخرى" text area for additional observations

## Technical Requirements
- Bilingual support (English and Arabic)
- Form validation
- Data storage and retrieval
- User-friendly interface
- Printable reports
