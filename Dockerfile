FROM node:latest
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN mkdir -p /app/uploads
RUN npm run build

CMD npx drizzle-kit push --force && npm start