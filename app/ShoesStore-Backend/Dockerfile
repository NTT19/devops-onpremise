# Dockerfile build Docker Image tối ưu cho .NET 8 Web API
# syntax=docker/dockerfile:1.7
# ==============================================================================
# Build Stage - Using .NET SDK for building
# ==============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS builder

WORKDIR /src

# Copy csproj and restore dependencies (optimized layer caching)
COPY backend/backend.csproj backend/
RUN dotnet restore backend/backend.csproj \
    --runtime linux-musl-x64 \
    /p:PublishReadyToRun=true

# Copy source code
COPY backend/ backend/

# Build and publish the application
RUN dotnet publish backend/backend.csproj \
    --configuration Release \
    --runtime linux-musl-x64 \
    --self-contained false \
    --output /app/publish \
    /p:PublishTrimmed=false \
    /p:PublishSingleFile=false \
    /p:DebugType=None \
    /p:DebugSymbols=false

# Generate development HTTPS certificate
RUN mkdir -p /app/https && \
    dotnet dev-certs https -ep /app/https/aspnetapp.pfx -p YourSecurePassword123!

# ==============================================================================
# Production Stage - Using .NET Runtime Alpine for minimal size
# ==============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS production

# Add OCI labels for metadata
LABEL org.opencontainers.image.title="Shoes Store Backend API" \
      org.opencontainers.image.description="Production-ready .NET 8 Web API" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.base.name="mcr.microsoft.com/dotnet/aspnet:8.0-alpine"

# Install required packages for SQL Server connection
RUN apk add --no-cache \
    icu-libs \
    icu-data-full \
    tzdata \
    curl

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app

# Create https directory and copy certificate
RUN mkdir -p /app/https

# Copy published files from builder
COPY --from=builder --chown=appuser:appuser /app/publish .
COPY --from=builder --chown=appuser:appuser /app/https /app/https

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 7102

# Configure environment variables
ENV ASPNETCORE_URLS=https://+:7102 \
    ASPNETCORE_ENVIRONMENT=Development \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    ASPNETCORE_Kestrel__Certificates__Default__Password=YourSecurePassword123! \
    ASPNETCORE_Kestrel__Certificates__Default__Path=/app/https/aspnetapp.pfx

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -k -f https://localhost:7102/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "backend.dll"]
