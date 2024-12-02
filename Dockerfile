# Stage 1: Build
FROM node:20.13.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20.13.1-alpine AS production

# Set working directory
WORKDIR /app

# Copy files from the builder stage
COPY --from=builder /app ./

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start:prod"]
