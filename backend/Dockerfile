FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install all dependencies (including dev) and build the app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM node:22-alpine AS runner

WORKDIR /usr/src/app

# Install only production dependencies in the final image
COPY package*.json ./
RUN npm install --omit=dev --silent

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/main.js"]