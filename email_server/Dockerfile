FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY email_server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY email_server/app.py .

# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
