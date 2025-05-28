FROM node:24 AS frontend-build

COPY frontend .
RUN npm install
RUN npm run build

FROM python:3.13-slim-bookworm
WORKDIR /app
COPY --from=frontend-build dist dist

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates libpq-dev build-essential

# Download the latest installer
ADD https://astral.sh/uv/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"
COPY backend .
RUN uv sync --locked
CMD uv run fastapi run app/app.py
CMD ["./scripts/wait-for-it.sh", "database:5432", "--", "uv", "run", "fastapi", "run", "app/app.py"]
