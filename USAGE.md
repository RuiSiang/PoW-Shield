# Usage

## Nodejs

Clone repository

```
git clone https://github.com/RuiSiang/PoW-Shield.git
```

Install dependencies

```
npm install
```

Configure settings(more information in [configure section](CONFIGURE.md))

```
cp -n .env.example .env
# edit .env
nano .env
```

Build

```
npm run build
```

Run with db (redis), recommended & faster
```
# install redis first
# sudo apt-get install redis-server
npm start
```

Run without db (mock redis)

```
npm run start-standalone
```

Test functionalities(optional)

```
npm test
```

## Docker ([repo](https://hub.docker.com/repository/docker/ruisiang/pow-shield))

### docker run with db (redis), recommended & faster

```
docker run -p 3000:3000 -e BACKEND_URL="http://example.com" -d ruisiang/pow-shield
```

### docker run without db (mock redis)

```
docker run -p 3000:3000 -e BACKEND_URL="http://example.com" -e NODE_ENV="standalone" -d ruisiang/pow-shield
```

### docker-compose

Configure docker-compose.example.yaml (more information in [configure section](CONFIGURE.md))

```
cp -n docker-compose.example.yaml docker-compose.yaml
# edit docker-compose.yaml
nano docker-compose.yaml
```

Start the container

```
docker-compose up
```
