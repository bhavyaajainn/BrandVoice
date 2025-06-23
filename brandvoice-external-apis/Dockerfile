# ---------- builder ----------
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
    && pip install --prefix=/install -r requirements.txt \
    && apt-get purge -y build-essential \
    && rm -rf /var/lib/apt/lists/*
# ---------- final ----------
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY ./app /app/app
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
ENV PORT=8080 HOST=0.0.0.0 PYTHONUNBUFFERED=1
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/docs || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
