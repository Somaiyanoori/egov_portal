# ============ Build Stage ============
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install all dependencies
RUN npm ci

# Copy source
COPY src ./src

# Generate Prisma client & build
RUN npx prisma generate
RUN npm run build

# ============ Production Stage ============
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev && npm cache clean --force
RUN npx prisma generate

# Copy built application
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs && chown -R node:node logs

# Non-root user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3012/api/v1/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

EXPOSE 3012

CMD ["node", "dist/server.js"]