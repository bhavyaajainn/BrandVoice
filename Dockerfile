FROM python:3.10-slim

WORKDIR /app
# Copy requirements first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the backend directory into the container
COPY ./backend .

# Add a script to fetch secrets
COPY fetch_secrets.sh /app/fetch_secrets.sh
RUN chmod +x /app/fetch_secrets.sh

EXPOSE 8080
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

