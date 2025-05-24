# Security Department Management System - Updated User Guide

## Overview
The Security Department Management System is a comprehensive solution for managing daily security operations, including security reports, CCTV reports, and inspection checklists. This guide provides detailed instructions for installing, configuring, and using the system.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Login and Authentication](#login-and-authentication)
4. [Dashboard Overview](#dashboard-overview)
5. [Daily Reports](#daily-reports)
6. [Inspection Checklists](#inspection-checklists)
7. [User Management](#user-management)
8. [Email Notifications](#email-notifications)
9. [Mobile Application](#mobile-application)
10. [Troubleshooting](#troubleshooting)

## System Requirements
- **Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions recommended)
- **Mobile Devices**: Android or iOS with Chrome or Safari
- **Internet Connection**: Required for initial setup and email notifications
- **Email Server**: For email notification functionality (optional)

## Installation

### Web Application Installation
1. Extract the `security_management_system.zip` file to your web server directory
2. Ensure all files and folders maintain their structure
3. Access the system by navigating to the index.html file in your browser
4. For local use, simply open the index.html file directly in your browser

### Email Server Setup (Optional)
1. Navigate to the `email_server` directory
2. Edit the `start_email_server.sh` script to configure your email credentials
3. Run the script to start the email notification server
4. Detailed instructions are provided in the email_server/README.md file

### Mobile Application Installation
For detailed instructions on installing the mobile application, please refer to the [Mobile Installation Guide](mobile_installation_guide.md).

## Login and Authentication

### Default Credentials
- Username: `admin`
- Password: `admin123`

### User Roles
The system supports four user roles with different permission levels:
1. **Super Admin**: Full system access, can manage all users and settings
2. **Admin**: Can manage regular users and access all reports
3. **Supervisor**: Can view all reports but cannot modify system settings
4. **Regular User**: Can create reports but only view their own submissions

### Changing Your Password
1. Log in with your credentials
2. Navigate to User Management (if you have admin privileges)
3. Find your user account and select "Edit"
4. Enter a new password and save changes

## Dashboard Overview
The dashboard provides an overview of recent reports and inspections, with quick access to create new entries.

### Navigation
- Use the tabs at the top of the page to navigate between different sections
- On mobile devices, use the bottom navigation bar

### Language Selection
- Toggle between English and Arabic using the language switch in the header
- All system content, including reports and forms, will update to the selected language

## Daily Reports

### Creating a New Report
1. Click on the "Daily Report" tab
2. Select the report type (Security Report or CCTV Report)
3. Fill in all required fields
4. Submit the report

### Security Report Fields
- Date and Time (auto-populated)
- Shift (A, B, or C)
- Security Officer Name
- Event Description
- Fire Alarm Status (with details if applicable)
- Reported Items (with details if applicable)

### CCTV Report Fields
- Date and Time (auto-populated)
- Shift (A, B, or C)
- Security Officer Name
- Camera Status
- Footage Review Details
- Incident Observations
- Storage Capacity Information

### Viewing and Printing Reports
1. From the dashboard, click on any report in the list
2. View the complete report details in the modal window
3. Click "Print" to print the report
4. Click "Download PDF" to save the report as a PDF file

## Inspection Checklists

### Creating a New Inspection
1. Click on the "Inspection Checklist" tab
2. Fill in the date and shift information
3. Complete the checklist items (Y/N/NA)
4. Add any additional findings in the text area
5. Submit the inspection

### Viewing and Printing Inspections
1. From the dashboard, click on any inspection in the list
2. View the complete inspection details in the modal window
3. Click "Print" to print the inspection
4. Click "Download PDF" to save the inspection as a PDF file

## User Management

### Accessing User Management
- Only users with Admin or Super Admin roles can access User Management
- Click on the "User Management" tab in the navigation menu

### Creating New Users
1. Click "Create New User" button
2. Fill in the required information:
   - Username
   - Password
   - Full Name (optional)
   - Email (optional)
   - Role (Admin, Supervisor, or Regular User)
3. Click "Create User" to save

### Editing Users
1. Find the user in the list
2. Click the "Edit" button
3. Modify the user information
4. Click "Save Changes"

### Deleting Users
1. Find the user in the list
2. Click the "Delete" button
3. Confirm the deletion

### User Permissions
Each role has specific permissions:
- **Super Admin**: Cannot be deleted or modified by other users
- **Admin**: Can manage users but cannot modify Super Admin accounts
- **Supervisor**: Can view all reports but cannot manage users
- **Regular User**: Can only view their own submissions

## Email Notifications

### Automatic Notifications
The system automatically sends email notifications to faisalaalammar@hotmail.com when:
- A new security report is submitted
- A new CCTV report is submitted
- A new inspection checklist is submitted

### Email Content
Each notification includes:
- Basic information about the submission
- A PDF attachment of the complete report or checklist
- Timestamp of when it was submitted

### Email Server Configuration
To configure the email server:
1. Edit the `email_server/app.py` file
2. Update the SMTP settings with your email provider details
3. Restart the email server

## Mobile Application

The system includes a mobile-friendly version that works on all smartphone systems. For detailed instructions, see the [Mobile Installation Guide](mobile_installation_guide.md).

### Key Mobile Features
- Install directly to your home screen
- Work offline when no internet connection is available
- Automatic synchronization when back online
- Touch-optimized interface
- Responsive design for all screen sizes

## Troubleshooting

### Login Issues
- Verify your username and password
- Check if your account is active (ask an administrator)
- Clear browser cache and cookies

### PDF Download Problems
- Ensure you're using a supported browser
- Check if JavaScript is enabled
- Try using a different browser if issues persist

### Email Notification Issues
- Verify the email server is running
- Check the email server logs for errors
- Confirm your SMTP settings are correct

### Mobile Application Issues
- Refer to the troubleshooting section in the [Mobile Installation Guide](mobile_installation_guide.md)

### Data Persistence Issues
- Ensure your browser allows local storage
- Do not use private/incognito browsing mode
- Regularly back up important reports by downloading PDFs

For additional support, please contact your system administrator.
