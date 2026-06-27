# Small, fast base image - good for quick CI builds
FROM node:18-alpine

WORKDIR /app

# Copy dependency manifests first so Docker can cache this layer
# and skip re-running npm install when only app code changes
COPY package*.json ./
RUN npm install --production

# Now copy the actual app code
COPY app.js ./

EXPOSE 3000

CMD ["node", "app.js"]
