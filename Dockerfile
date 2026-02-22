# === Build stage: generate wiki.html from docs/ + src/ ===
FROM python:3-alpine AS build
WORKDIR /app
COPY docs/ docs/
COPY src/ src/
COPY build.py .
RUN python build.py

# === Final stage: serve wiki.html with busybox httpd (~1.2MB image) ===
FROM busybox:musl
COPY --from=build /app/wiki.html /var/www/index.html
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/var/www"]
