# syntax=docker/dockerfile:1

# Use dev variant for building
FROM dhi.io/node:26-alpine-dev AS build-stage

WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

# Yarn v1 works out of the box
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies and ensure node_modules exists
RUN npm i --omit=dev && mkdir -p node_modules

# Use runtime variant for final image
FROM dhi.io/node:26-alpine-dev AS runtime-stage
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy node_modules from build stage
COPY --from=build-stage /usr/src/app/node_modules ./node_modules

# Copy application code
COPY src ./src
COPY package*.json ./

# Expose port (use non-privileged port)
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]
