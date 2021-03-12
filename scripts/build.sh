#!bin/bash
cp -n .env.example .env && \
echo "Starting Build..." && \
tsc && \
echo "Build Successful!" && \
echo "Copying Files..." && \
cp -rfRT views dist/views && \
cp -rfRT public dist/public && \
cp package.json dist/package.json && \
cp .env dist/.env && \
browserify lib/bundle.js -t uglifyify | uglifyjs > dist/public/javascripts/bundle.min.js && \
echo "Success!"