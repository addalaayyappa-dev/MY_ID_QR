# ---------- Build Stage ----------
FROM node:18 AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build Vite app (output goes to dist/)
RUN npm run build

# ---------- Production Stage (Nginx) ----------
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static files
RUN rm -rf ./*

# Copy built files from builder
COPY --from=builder /app/dist ./

# Expose port 80 (nginx default)
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
