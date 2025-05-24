# Security Department Management System - User Guide

## Overview

The Security Department Management System is a web-based application designed to help security departments manage their daily operations. The system includes two main components:

1. **Daily Security Report** - For documenting security events, officer information, and specific incidents
2. **Security Inspection Checklist** - For conducting regular security inspections with standardized criteria

## Features

- **Automated Date/Time/Shift** - Automatically sets the current date, time, and appropriate shift
- **Bilingual Support** - Full English and Arabic language support
- **Conditional Logic** - Dynamic form fields that appear based on responses
- **Local Storage** - Saves all reports and inspections in the browser's local storage
- **Print Functionality** - Ability to print reports and checklists
- **Responsive Design** - Works on both desktop and mobile devices

## Installation Instructions

This is a client-side web application that runs entirely in the browser. No server-side installation is required.

### Option 1: Running Locally

1. Extract all files to a folder on your computer
2. Open the `index.html` file in a web browser (Chrome, Firefox, Edge, etc.)
3. The application will load and is ready to use

### Option 2: Hosting on a Web Server

1. Upload all files and folders to your web server
2. Access the application by navigating to the URL where you uploaded the files
3. The application will load and is ready to use

## Using the Application

### Dashboard

The dashboard is the main screen of the application. From here, you can:

- View recent reports and inspections
- Create new reports or inspections
- Switch between English and Arabic languages

### Daily Security Report

To create a new daily security report:

1. Click on "Daily Report" tab or "Create New Report" button
2. The date, time, and shift will be automatically filled based on the current time
3. Enter the security officer's name
4. Describe any events that occurred during the shift (if any)
5. Answer the fire alarm question:
   - If "Yes", provide details about the fire alarm incident
   - If "No", proceed to the next question
6. Answer the reported items question:
   - If "Yes", provide details about the reported item and reporter information
   - If "No", proceed to submit
7. Click "Submit Report" to save the report

### Security Inspection Checklist

To create a new security inspection checklist:

1. Click on "Inspection Checklist" tab or "Create New Inspection" button
2. The date will be automatically filled with the current date
3. Select the appropriate shift (1st, 2nd, or 3rd)
4. For each of the 12 inspection items, select one of the following:
   - Y (Yes) - The item meets security standards
   - N (No) - The item does not meet security standards
   - NA (Not Applicable) - The item is not applicable
5. Enter any additional findings or observations in the "Other findings" section
6. Click "Submit Inspection" to save the checklist

### Viewing and Printing Reports/Checklists

To view or print a saved report or checklist:

1. Go to the Dashboard
2. Find the report or checklist you want to view in the list
3. Click the "View" button
4. A modal will appear showing all details of the report or checklist
5. Click "Print" to print the report or checklist

### Changing Language

To switch between English and Arabic:

1. Use the language toggle switch in the top-right corner of the application
2. All text will immediately change to the selected language

## Data Storage

All reports and checklists are stored in your browser's local storage. This means:

- Data persists even if you close and reopen the browser
- Data is stored only on the device you are using
- Clearing browser data will remove all saved reports and checklists

## Support

For any issues or questions about the application, please contact your system administrator or IT support team.

---

Thank you for using the Security Department Management System!
