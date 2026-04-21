# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Build the app
COPY . .

# Production backend URL — hardcoded so Vite bakes it into the bundle at build time.
# Change this value and redeploy if the backend URL ever changes.
ENV VITE_API_BASE_URL=https://tanitrade-backend-272412134779.asia-southeast1.run.app/api/v1

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 as expected by Cloud Run
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
