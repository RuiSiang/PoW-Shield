# Configuration

## Configure Methods

- nodejs: .env (example: .env.example)
- docker-compose: docker-compose.yaml (example: docker-compose.example.yaml)
- docker run: -e parameter

## Envoronmental Variables

General Options

- PORT: (default:3000) port that PoW Shield listens to
- SESSION_KEY: secret key for cookie signatures, use a unique one for security reasons, or anyone can forge your signed cookies
- BACKEND_URL: location to proxy authenticated traffic to, IP and URLs are both accepted(accepts protocol://url(:port) or protocol://ip(:port))

PoW Options

- POW: (default:on) toggles PoW functionality on/off (if not temporary switched off, why use this project at all?)
- NONCE_VALIDITY: (default:60000) specifies the maximum seconds a nonce has to be submitted to the server after generation(used to enforce difficulty change and filter out stale nonces)
- INITIAL_DIFFICULTY: (default:13) initial difficulty, number of leading 0-bits in produced hash (0:extremely easy ~ 256:impossible, 13(default) takes about 5 seconds for the browser to calculate)

Ratelimit Options

- RATE_LIMIT: (default:on) toggles ratelimit functionality on/off
- RATE_LIMIT_SAMPLE_MINUTES: (default:60) specifies how many minutes until statistics reset for session/ip
- RATE_LIMIT_SESSION_THRESHOLD: (default:100) number of requests that a single session can make until triggering token revocation
- RATE_LIMIT_BAN_IP: (default:on) toggles ip banning functionality on/off
- RATE_LIMIT_IP_THRESHOLD: (default:500) number of requests that a single session can make until triggering IP ban
- RATE_LIMIT_BAN_MINUTES: (default:15) number of minutes that IP ban persists

WAF Options

- WAF: (default:on) toggles waf functionality on/off (waf is still a work in progress)
