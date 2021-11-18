################################
# DEVELOPMENT
################################
#
#
FROM node:14-alpine AS development
ENV NODE_ENV development
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
RUN npm install -g npm-run-all --loglevel verbose
RUN npm install --loglevel verbose
# Copy app files
COPY . .
# Expose port
EXPOSE 5000
# Change USER
# USER node 
# Start the app
CMD [ "npm", "start" ]
#
#
#
#
################################
# Testing
################################
FROM node:14-alpine AS testing-builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
RUN npm install --only=production  --loglevel verbose
# Copy app files
COPY . .
# Build the app
RUN npm run build
# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as testing
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
#
#
#
#
################################
# PRODUCTION
################################
FROM node:14-alpine AS builder
ENV NODE_ENV production
# Add a work directory
WORKDIR /app
# Cache and Install dependencies
COPY package.json .
RUN npm install --only=production  --loglevel verbose
# Copy app files
COPY . .
# Build the app
RUN npm run build
# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]