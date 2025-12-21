# Dockerfile build Docker Image nhẹ nhất cho React App
# syntax=docker/dockerfile:1.7
# ==============================================================================
# Build Stage - Using Node Alpine for minimal size
# ==============================================================================
FROM node:18-alpine AS builder

# Install gzip for pre-compression
RUN apk add --no-cache gzip

WORKDIR /app

# Copy package files for dependency installation (optimized layer caching)
COPY package.json package-lock.json ./

# Install dependencies with cache mount for faster rebuilds
# Use npm ci for clean install from lockfile
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --no-audit --no-fund

# Copy source files (React app structure)
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build && \
    # Verify build output exists
    test -d build && test -f build/index.html && \
    # Create a minimal health check endpoint
    echo "OK" > build/health && \
    # Pre-compress all static files with gzip (level 9 = maximum compression)
    find build -type f \( \
        -name "*.html" -o \
        -name "*.css" -o \
        -name "*.js" -o \
        -name "*.json" -o \
        -name "*.xml" -o \
        -name "*.txt" -o \
        -name "*.svg" -o \
        -name "*.ico" \
    \) -exec sh -c 'gzip -9 -k "{}"' \;

# ==============================================================================
# Production Stage - Using Nginx Alpine for SPA routing support
# ==============================================================================
FROM nginx:alpine AS production

# Add OCI labels for metadata
LABEL org.opencontainers.image.title="Shoes Store Frontend" \
      org.opencontainers.image.description="Production-ready React application" \
      org.opencontainers.image.version="0.1.0" \
      org.opencontainers.image.licenses="MIT"

# Copy built assets from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Create nginx configuration for SPA routing (fallback to index.html)
RUN echo 'server { \
    listen 3000; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_static on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
        try_files $uri =404; \
    } \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]