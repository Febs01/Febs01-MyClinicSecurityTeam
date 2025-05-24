#!/bin/bash

# Start the email notification server
echo "Starting email notification server..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3 to run the email server."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "email_server_venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv email_server_venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source email_server_venv/bin/activate

# Install requirements
echo "Installing requirements..."
pip install -r email_server/requirements.txt

# Set environment variables for email configuration
export SMTP_SERVER="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_USERNAME="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"
export RECIPIENT_EMAIL="faisalaalammar@hotmail.com"

# Run the Flask app
echo "Starting email server..."
cd email_server
python app.py &
SERVER_PID=$!
cd ..

echo "Email server started with PID: $SERVER_PID"
echo "Server is running on http://localhost:5000"
echo ""
echo "IMPORTANT: You need to set up your own email credentials for the server to work."
echo "For Gmail, you'll need to create an App Password: https://myaccount.google.com/apppasswords"
echo ""
echo "To stop the server, run: kill $SERVER_PID"

# Save PID to file for later reference
echo $SERVER_PID > email_server.pid
