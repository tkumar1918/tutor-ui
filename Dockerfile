###############################################################################
# Build stage — produce static assets in /app/dist
###############################################################################
FROM node:22-alpine AS build

WORKDIR /app

# Install deps. We use `npm install` rather than `npm ci` because the lockfile
# is generated on the host platform (likely glibc) and may not list every
# optional native/WASM fallback needed on Alpine (musl). `npm install` still
# honors the lockfile for version pinning — it just won't refuse on missing
# optional deps.
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

# Vite bakes env vars at build time. Pass via --build-arg.
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .
RUN npm run build

###############################################################################
# Runtime stage — nginx serves the SPA
###############################################################################
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q -O - http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
