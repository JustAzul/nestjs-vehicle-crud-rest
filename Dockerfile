# Stage 1: Build
FROM node:20.13.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20.13.1-alpine AS production

# Set working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN npm install --omit=dev

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/main.js"]
