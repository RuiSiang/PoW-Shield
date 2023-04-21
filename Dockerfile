FROM node:20 AS BUILD_IMAGE
WORKDIR /build
COPY . .
ARG PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /usr/src/pow-shield
COPY --from=BUILD_IMAGE /build/dist .
COPY --from=BUILD_IMAGE /build/node_modules ./node_modules
CMD [ "node", "bin/server.js" ]
