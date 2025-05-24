import os
import smtplib
import tempfile
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Email configuration
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USERNAME = os.environ.get('SMTP_USERNAME', 'your-email@gmail.com')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', 'your-app-password')
RECIPIENT_EMAIL = 'faisalaalammar@hotmail.com'

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok"})

@app.route('/send-email', methods=['POST'])
def send_email():
    """
    Send email with PDF attachment
    
    Expected JSON payload:
    {
        "subject": "Report Subject",
        "message": "Email message body",
        "pdf_data": "base64 encoded PDF data",
        "filename": "report.pdf"
    }
    """
    try:
        # Get request data
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        # Extract required fields
        subject = data.get('subject')
        message_body = data.get('message')
        pdf_data = data.get('pdf_data')
        filename = data.get('filename', 'report.pdf')
        
        # Validate required fields
        if not all([subject, message_body, pdf_data]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400
        
        # Create email
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = subject
        
        # Add message body
        msg.attach(MIMEText(message_body, 'plain'))
        
        # Add PDF attachment
        try:
            # Decode base64 PDF data
            import base64
            pdf_binary = base64.b64decode(pdf_data)
            
            # Create attachment
            attachment = MIMEApplication(pdf_binary, _subtype='pdf')
            attachment.add_header('Content-Disposition', 'attachment', filename=filename)
            msg.attach(attachment)
        except Exception as e:
            logger.error(f"Error processing PDF attachment: {str(e)}")
            return jsonify({"success": False, "error": f"Error processing PDF attachment: {str(e)}"}), 400
        
        # Send email
        try:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
                logger.info(f"Email sent successfully to {RECIPIENT_EMAIL}")
                return jsonify({"success": True, "message": "Email sent successfully"})
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return jsonify({"success": False, "error": f"Error sending email: {str(e)}"}), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({"success": False, "error": f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run the app
    app.run(host='0.0.0.0', port=port)
