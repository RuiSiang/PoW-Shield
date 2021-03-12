FROM node:12
WORKDIR /usr/src/pow-shield
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE ${PORT}
CMD [ "node", "dist/bin/server.js" ]