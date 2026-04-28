# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — BUILD
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies required for the build
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — PRODUCTION
# Minimal image with only Node.js runtime
# ─────────────────────────────────────────────────────────────────────────────
FROM alpine:3.19 AS production

LABEL maintainer="Nathanmar"
LABEL version="1.0.0"
LABEL description="Data Mock REST API"

WORKDIR /app

# Install Node.js runtime without npm
RUN apk add --no-cache nodejs

# Copy production artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY public/ ./public/

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/presentation/index.js"]
