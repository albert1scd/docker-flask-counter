# Use Python 3.9 slim image as base
FROM python:3.9-slim

# Set working directory in container
WORKDIR /app

# Copy requirements file
COPY app/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/templates ./templates
COPY app/static ./static
COPY app/app.py .

# Expose port 5000
EXPOSE 5000

# Command to run the application
CMD ["python", "app.py"]
