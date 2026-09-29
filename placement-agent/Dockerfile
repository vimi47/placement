FROM python:3.12-slim

RUN pip install --no-cache-dir uv==0.8.13

WORKDIR /code

COPY pyproject.toml README.md uv.lock* ./

COPY app ./app
COPY agents ./agents
COPY routes ./routes
COPY mongodb.py ./mongodb.py

RUN uv sync --frozen

ARG AGENT_VERSION=0.0.0
ENV AGENT_VERSION=${AGENT_VERSION}

EXPOSE 8080

CMD ["sh", "-c", "uv run uvicorn app.fast_api_app:app --host 0.0.0.0 --port ${PORT:-8080}"]
