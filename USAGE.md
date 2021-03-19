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

Build and run

```
npm run build
npm start
```

Test functionalities(optional)

```
npm test
```

## Docker ([repo](https://hub.docker.com/repository/docker/ruisiang/pow-shield))

### docker run

```
docker run -p 3000:3000 -e BACKEND_URL="http://example.com" -d ruisiang/pow-shield
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
