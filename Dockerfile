# Use Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy files into the image
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the Flask default port
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]
