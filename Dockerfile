# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — BUILD
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Installation de TOUTES les dependances pour compiler
RUN npm ci

COPY src/ ./src/
RUN npm run build

# On nettoie les dependances de developpement directement dans le builder
RUN npm prune --omit=dev

# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — PRODUCTION
# Image ultra-legere : Alpine pure + juste l'executable Node.js (sans npm/yarn)
# ─────────────────────────────────────────────────────────────────────────────
FROM alpine:3.19 AS production

LABEL maintainer="Nathanmar"
LABEL version="1.0.0"
LABEL description="Data Mock REST API"

WORKDIR /app

# Installation de Node.js (sans npm) pour reduire la taille
RUN apk add --no-cache nodejs

# On recupere les node_modules de prod, le JS compile, le package.json (pour type: module) et les statiques
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
