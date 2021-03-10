#!bin/bash
tsc && \
echo "asdf" && \
cp -rfRT views dist/views && \
cp -rfRT public dist/public && \
cp package.json dist/package.json && \
cp config.js dist/config.js && \
browserify lib/bundle.js -t uglifyify | uglifyjs > dist/public/javascripts/bundle.min.js