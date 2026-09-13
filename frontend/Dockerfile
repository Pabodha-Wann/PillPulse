# ─────────────────────────────────────────────────────────
# Stage 1: Build the Next.js application
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .

# Build-time environment variables for K8s internal networking
# These are baked into the JS bundle during `npm run build`
ARG NEXT_PUBLIC_API_URL=http://api-gateway:8080
ARG NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:30180
ARG NEXT_PUBLIC_KEYCLOAK_REALM=pillpulse
ARG NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=pillpulse-gateway

RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 2: Production runtime (minimal image)
# ─────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copy only the standalone output (no node_modules bloat)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
