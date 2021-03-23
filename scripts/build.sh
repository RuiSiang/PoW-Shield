#!bin/bash
cp -n .env.example .env && \
echo "Starting Build..." && \
tsc && \
echo "Build Successful!" && \
echo "Copying Files..." && \
cp -rfRT views dist/views && \
cp -rfRT public dist/public && \
cp wafRules.json dist/wafRules.json && \
cp wafTypes.json dist/wafTypes.json && \
cp package.json dist/package.json && \
cp .env dist/.env && \
browserify service/bundle.js -t uglifyify | uglifyjs > dist/public/javascripts/bundle.min.js && \
echo "Success!"