# Multi-stage Dockerfile for Node.js Backend

# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Install native build tools for C/C++ modules (e.g. bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm install --legacy-peer-deps --allow-remote=all --omit=dev

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment defaults
ENV NODE_ENV=production \
    PORT=8080

# Create dedicated non-root user and required directories
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs \
    && mkdir -p /app/logs /app/public/temp \
    && chown -R nodejs:nodejs /app

# Copy installed dependencies and source code
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs package.json ./
COPY --chown=nodejs:nodejs src ./src
COPY --chown=nodejs:nodejs scripts ./scripts

# Switch to non-root user
USER nodejs

# Expose backend port
EXPOSE 8080

# Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/api/v1/health || exit 1

# Start production server
CMD ["node", "src/index.js"]
