<img height=auto width=100% src="https://raw.githubusercontent.com/RuiSiang/PoW-Shield/main/screenshot.jpg" alt="PoW Shield">
<div align="center">
  <img src="https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml/badge.svg">
  <img src="https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml/badge.svg">
  <img src="https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml/badge.svg">
  <a href="https://hub.docker.com/r/ruisiang/pow-shield">
    <img src="https://img.shields.io/docker/image-size/ruisiang/pow-shield/latest?label=docker%20image%20size">
  </a>
</div>
<div align="center">
  <img src="https://img.shields.io/github/repo-size/ruisiang/pow-shield?color=orange">
  <a href="https://deepsource.io/gh/RuiSiang/PoW-Shield/?ref=repository-badge">
    <img src="https://deepsource.io/gh/RuiSiang/PoW-Shield.svg/?label=active+issues&show_trend=true&token=yoFuBlRVaXTzIVkgAB6aSUf3">
  </a>
  <a href="https://deepsource.io/gh/RuiSiang/PoW-Shield/?ref=repository-badge">
    <img src="https://deepsource.io/gh/RuiSiang/PoW-Shield.svg/?label=resolved+issues&show_trend=true&token=yoFuBlRVaXTzIVkgAB6aSUf3">
  </a>
</div>

## Description

PoW Shield provides DDoS protection on OSI application layer by acting as a proxy that utilizes proof of work between the backend service and the end user. This project aims to provide an alternative to general anti-DDoS methods such as Google's ReCaptcha that has always been a pain to solve. Accessing a web service protected by PoW Shield has never been easier, simply go to the url, and your browser will do the rest of the verification automatically for you.

PoW Shield aims to provide the following services bundled in a single webapp / docker image:

- proof of work authentication
- ratelimiting and ip blacklisting
- web application firewall

(New) [Article on LinkedIn](https://www.linkedin.com/feed/update/urn:li:ugcPost:6994133790017163264?updateEntityUrn=urn%3Ali%3Afs_updateV2%3A%28urn%3Ali%3AugcPost%3A6994133790017163264%2CFEED_DETAIL%2CEMPTY%2CDEFAULT%2Cfalse%29)

[Featured on Pentester Academy TV](https://youtu.be/zeNKUDR7_Jc 'The Tool Box | PoW Shield')

[Story on Medium](https://ruisiang.medium.com/pow-shield-application-layer-proof-of-work-ddos-filter-4fed32465509 'PoW Shield: Application Layer Proof of Work DDoS Filter')

## Features

- Web Service Structure
- Proxy Functionality
- PoW Implementation
- Dockerization
- IP Blacklisting
- Ratelimiting
- Unit Testing
- WAF Implementation
- Multi-Instance Syncing (Redis)
- SSL Support

Supported via [PoW Phalanx](https://github.com/ruisiang/PoW-Phalanx) controller:
- Multi-instance Management
- Whitelist tokens
- Blacklist IP syncing
- Dynamic difficulty control
- Dashboard

Alternate implementation in Go [PoW-Shield-Go](https://github.com/RuiSiang/Pow-Shield-Go) (WIP) for stress testing purposes and future optimized production version.

## How it Works

So basically, PoW Shield works as a proxy in front of the actual web app/service. It conducts verification via proof-of-work and only proxies authorized traffic through to the actual server. The proxy is easily installable, and is capable of protecting low security applications with a WAF.

Here’s what happens behind the scenes when a user browses a PoW Shield-protected webservice:

1. The server generates a random hex-encoded “prefix” and sends it along with the PoW Shield page to the client.
2. Browser JavaScript on the client side then attempts to brute-force a “nonce” that when appended with the prefix, can produce a SHA256 hash with the number of leading zero-bits more than the “difficulty” D specified by the server. i.e. SHA256(prefix + nonce)=0…0xxxx (binary, with more than D leading 0s)
3. Client-side JavaScript then sends the calculated nonce to the server for verification, if verification passes, the server generates a cookie for the client to pass authentication.
4. The server starts proxying the now authenticated client traffic to the server with WAF filtering enabled.

## Configuration

You can configure PoW Shield via the following methods.

- nodejs: .env (example: .env.example)
- docker-compose: docker-compose.yaml (example: docker-compose.example.yaml)
- docker run: -e parameter

### Environmental Variables

| Variable                     | Type       | Default                 | Description                                                                                                                                                       |
| ---------------------------- | ---------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PORT                         | General    | 3000                    | port that PoW Shield listens to                                                                                                                                   |
| SESSION_KEY                  | General    |                         | secret key for cookie signatures, use a unique one for security reasons, or anyone can forge your signed cookies                                                  |
| BACKEND_URL                  | General    |                         | location to proxy authenticated traffic to, IP and URLs are both accepted(accepts protocol://url(:port) or protocol://ip(:port))                                  |
| DATABASE_HOST                | Redis      | 127.0.0.1               | redis service host                                                                                                                                                |
| DATABASE_PORT                | Redis      | 6379                    | redis service port                                                                                                                                                |
| DATABASE_PASSWORD            | Redis      | null                    | redis service password                                                                                                                                            |
| POW                          | PoW        | on                      | toggles PoW functionality on/off (if not temporary switched off, why use this project at all?)                                                                    |
| NONCE_VALIDITY               | PoW        | 60000                   | specifies the maximum seconds a nonce has to be submitted to the server after generation(used to enforce difficulty change and filter out stale nonces)           |
| DIFFICULTY                   | PoW        | 13                      | problem difficulty, number of leading 0-bits in produced hash (0:extremely easy ~ 256:impossible, 13(default) takes about 5 seconds for the browser to calculate) |
| RATE_LIMIT                   | Rate Limit | on                      | toggles ratelimit functionality on/off                                                                                                                            |
| RATE_LIMIT_SAMPLE_MINUTES    | Rate Limit | 60                      | specifies how many minutes until statistics reset for session/ip                                                                                                  |
| RATE_LIMIT_SESSION_THRESHOLD | Rate Limit | 100                     | number of requests that a single session can make until triggering token revocation                                                                               |
| RATE_LIMIT_BAN_IP            | Rate Limit | on                      | toggles ip banning functionality on/off                                                                                                                           |
| RATE_LIMIT_IP_THRESHOLD      | Rate Limit | 500                     | number of requests that a single session can make until triggering IP ban                                                                                         |
| RATE_LIMIT_BAN_MINUTES       | Rate Limit | 15                      | number of minutes that IP ban persists                                                                                                                            |
| WAF                          | WAF        | on                      | toggles waf functionality on/off                                                                                                                                  |
| WAF_URL_EXCLUDE_RULES        | WAF        |                         | exclude rules to check when scanning request url, use ',' to seperate rule numbers, use '-' to specify a range (eg: 1,2-4,5,7-10)                                 |
| WAF_HEADER_EXCLUDE_RULES     | WAF        | 14,33,80,96,100         | exclude rules to check when scanning request header, use ',' to seperate rule numbers, use '-' to specify a range (eg: 1,2-4,5,7-10)                              |
| WAF_BODY_EXCLUDE_RULES       | WAF        |                         | exclude rules to check when scanning request body, use ',' to seperate rule numbers, use '-' to specify a range (eg: 1,2-4,5,7-10)                                |
| SSL                          | SSL        | off                     | toggles SSL functionality on/off                                                                                                                                  |
| SSL_CERT_PATH                | SSL        | tests/ssl/mock-cert.pem | path to SSL certificate password                                                                                                                                  |
| SSL_KEY_PATH                 | SSL        | tests/ssl/mock-key.pem  | path to SSL key                                                                                                                                                   |
| SOCKET                       | Socket     | off                     | toggles socket functionality on/off                                                                                                                               |
| SOCKET_URL                   | Socket     |                         | location of PoW Phalanx controller, IP and URLs are both accepted(accepts protocol://url:port or protocol://ip:port)                                              |
| SOCKET_TOKEN                 | Socket     |                         | subscription token for PoW Phalanx controller                                                                                                                     |

## Usage

### Nodejs

#### Prerequisites

- Docker ^19.0.0
- Nodejs ^14.0.0

```bash
# Clone repository
git clone https://github.com/RuiSiang/PoW-Shield.git

# Install dependencies
npm install

# Configure settings
cp -n .env.example .env
# Edit .env
nano .env

# Transpile
npm run build

#############################################
# Run with db (redis), recommended & faster #
# install redis first                       #
# sudo apt-get install redis-server         #
#############################################
npm start
#############################################

#############################################
#        Run without db (mock redis)        #
#############################################
npm run start:standalone # linux
npm run start:standalone-win # windows
#############################################

# Test functionalities(optional)
npm test

```

### Docker ([repo](https://hub.docker.com/repository/docker/ruisiang/pow-shield))

```bash
####################################################
# Docker run with db (redis), recommended & faster #
####################################################
docker run -p 3000:3000 -e BACKEND_URL="http://example.com" -d ruisiang/pow-shield
####################################################

####################################################
#        Docker run without db (mock redis)        #
####################################################
docker run -p 3000:3000 -e BACKEND_URL="http://example.com" -e NODE_ENV="standalone" -d ruisiang/pow-shield
####################################################

####################################################
#                  Docker Compose                  #
####################################################
# Copy docker-compose.example.yaml
cp -n docker-compose.example.yaml docker-compose.yaml
# Edit docker-compose.yaml
nano docker-compose.yaml

# Start the container
docker-compose -f docker-compose.yaml up
####################################################
```

## Stress Test

Note: This only works on non-containerized version of PoW Shield, and that your system might experience unstability when running the test.

```bash
# Start the stress test
npm run stress

# If you changed the PORT variable in .env, you should also change the target variable in the stress test script
nano scripts/stress.sh
```

_The following tests are are conducted on a single thread of a i7-10870H CPU with a 60 second period for each concurrent parameter._

### Mass GET

| Concurrent Connections | Avg Latency | Error Rate | Requests/Second |
| ---------------------: | ----------: | ---------: | --------------: |
|                     64 |      15.3ms |     0.0000 |            4188 |
|                    128 |      30.2ms |     0.0000 |            4229 |
|                    256 |      60.4ms |     0.0000 |            4235 |
|                    512 |     122.6ms |     0.0142 |            4166 |
|                   1024 |     261.7ms |     0.1766 |            3894 |
|                   2048 |    1966.5ms |     0.4979 |            1027 |
|                   4096 |      4685ms |     0.7179 |             838 |

### Nonce Flood

| Concurrent Connections | Avg Latency | Error Rate | Requests/Second |
| ---------------------: | ----------: | ---------: | --------------: |
|                     64 |      15.6ms |        N/A |            4094 |
|                    128 |      31.5ms |        N/A |            4058 |
|                    256 |      61.5ms |        N/A |            4159 |
|                    512 |     129.5ms |        N/A |            3945 |
|                   1024 |     264.4ms |        N/A |            3858 |
|                   2048 |     592.1ms |        N/A |            3407 |
|                   4096 |    1212.6ms |        N/A |            3322 |

From the above sample, we can see that the appropriate max load estimate for PoW Shield is around 512 concurrent connections. Error rates and latencies deteriorate beyond normal acceptance afterwards. Hence in a load-balanced environment on the machine (1 PoW Shield instance on each of it's 8 cores), it should be able to handle a maximum of approximately 4096 concurrent connections (clients) at a total request rate of 32k requests/second.

## References

- Proof-of-work by Fedor Indutny (PoW utility functions)
- Shadowd by Zesecure (WAF rules)

## License

MIT
