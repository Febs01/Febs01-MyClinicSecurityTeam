# Email Notification System Design

## Overview
The email notification system will automatically send a copy of submitted reports and inspection checklists to the specified email address (faisalaalammar@hotmail.com) with the PDF report attached.

## Requirements
1. Send email notifications when reports or inspections are submitted
2. Include PDF version of the report/inspection as an attachment
3. Work with both security reports and CCTV reports
4. Work with inspection checklists
5. Provide confirmation to users when email is sent
6. Handle errors gracefully

## Technical Approach

### Server-Side Component
Since the application is primarily client-side, we need to create a lightweight server component to handle email sending. Options:

1. **Flask API (Selected)**
   - Simple Python-based API to handle email requests
   - Easy to deploy and maintain
   - Good libraries for email handling and PDF processing

2. **Serverless Function**
   - Could use AWS Lambda or similar
   - Requires cloud provider account and setup

3. **Email Service Provider API**
   - Could use SendGrid, Mailgun, etc.
   - Requires account setup and API keys

### Implementation Plan

1. Create a Flask application with:
   - `/send-email` endpoint that accepts POST requests
   - PDF attachment handling
   - Email sending functionality using SMTP

2. Update client-side code to:
   - Call the email API when reports are submitted
   - Convert report data to PDF before sending
   - Show success/error messages to users

3. Deploy the Flask application to make it accessible to the client

### Data Flow
1. User submits a report or inspection
2. Client-side code generates PDF
3. Client sends report data and PDF to server API
4. Server sends email with PDF attachment
5. Server returns success/error response
6. Client shows appropriate message to user

## Security Considerations
1. Use HTTPS for all API communications
2. Validate input data on server side
3. Limit email sending to prevent abuse
4. Sanitize data before including in emails
5. Use environment variables for sensitive information (SMTP credentials)

## Error Handling
1. Handle network errors when calling API
2. Handle email sending failures
3. Provide meaningful error messages to users
4. Log errors on server for troubleshooting

## Testing Plan
1. Test email sending with various report types
2. Test with different PDF sizes
3. Test error scenarios (network issues, invalid email)
4. Verify email delivery and attachment integrity
