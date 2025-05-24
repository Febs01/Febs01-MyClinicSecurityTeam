#!/bin/bash

# Start the email notification server
echo "Starting email notification server..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker to run the email server."
    exit 1
fi

# Build the Docker image
echo "Building Docker image for email server..."
docker build -t security-email-server ./email_server

# Run the Docker container
echo "Running email server container..."
docker run -d --name security-email-server \
    -p 5000:5000 \
    -e SMTP_SERVER="smtp.gmail.com" \
    -e SMTP_PORT="587" \
    -e SMTP_USERNAME="your-email@gmail.com" \
    -e SMTP_PASSWORD="your-app-password" \
    security-email-server

echo "Email server started on port 5000"
echo "To configure email settings, please edit the environment variables in this script."
echo ""
echo "IMPORTANT: You need to set up your own email credentials for the server to work."
echo "For Gmail, you'll need to create an App Password: https://myaccount.google.com/apppasswords"
