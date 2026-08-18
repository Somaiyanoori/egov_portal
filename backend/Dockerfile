# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps
WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl libc6-compat

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --ignore-scripts && \
    npx prisma generate

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY package*.json tsconfig.json ./
COPY src ./src

RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production
WORKDIR /app

# Security: Install only what's needed
RUN apk add --no-cache openssl libc6-compat dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /app/prisma ./prisma

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package*.json ./

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Environment
ENV NODE_ENV=production
ENV PORT=3012

# Expose port
EXPOSE 3012

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3012/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]