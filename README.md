<h1 align="center">PoW Shield</h1>

[![nodejs-ci](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml)
[![njsscan sarif](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml)
[![CodeQL](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/ruisiang/pow-shield?color=orange)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/ruisiang/pow-shield/latest?label=docker%20image%20size)](https://hub.docker.com/r/ruisiang/pow-shield)
[![](https://images.microbadger.com/badges/version/ruisiang/pow-shield.svg)](https://hub.docker.com/r/ruisiang/pow-shield)
[![DeepSource](https://deepsource.io/gh/RuiSiang/PoW-Shield.svg/?label=active+issues&show_trend=true&token=yoFuBlRVaXTzIVkgAB6aSUf3)](https://deepsource.io/gh/RuiSiang/PoW-Shield/?ref=repository-badge)
[![DeepSource](https://deepsource.io/gh/RuiSiang/PoW-Shield.svg/?label=resolved+issues&show_trend=true&token=yoFuBlRVaXTzIVkgAB6aSUf3)](https://deepsource.io/gh/RuiSiang/PoW-Shield/?ref=repository-badge)

Project dedicated to provide DDoS protection with proof-of-work

![screenshot](https://raw.githubusercontent.com/RuiSiang/PoW-Shield/main/screenshot.jpg)

## Description

PoW Shield provides DDoS protection on OSI application layer by acting as a proxy that utilizes proof of work between the backend service and the end user. This project aims to provide an alternative to general captcha methods such as Google's ReCaptcha that has always been a pain to solve. Accessing a web service protected by PoW Shield has never been easier, simply go to the url, and your browser will do the rest of the verification automatically for you.

PoW Shield aims to provide the following services bundled in a single webapp / docker image:

- proof of work authentication
- ratelimiting and ip blacklisting
- web application firewall

[Story on Medium](https://ruisiang.medium.com/pow-shield-application-layer-proof-of-work-ddos-filter-4fed32465509 'PoW Shield: Application Layer Proof of Work DDoS Filter')

[Featured on Pentester Academy TV](https://youtu.be/zeNKUDR7_Jc 'The Tool Box | PoW Shield')

## How it Works

So basically, PoW Shield works as a proxy in front of the actual web app/service. It conducts verification via proof-of-work and only proxies authorized traffic through to the actual server. The proxy is easily installable, and is capable of protecting low security applications with a WAF.

Here’s what happens behind the scenes when a user browses a PoW Shield-protected webservice:

1. The server generates a random hex-encoded “prefix” and sends it along with the PoW Shield page to the client.
2. Browser JavaScript on the client side then attempts to brute-force a “nonce” that when appended with the prefix, can produce a SHA256 hash with the number of leading zero-bits more than the “difficulty” D specified by the server. i.e. SHA256(prefix + nonce)=0…0xxxx (binary, with more than D leading 0s)
3. Client-side JavaScript then sends the calculated nonce to the server for verification, if verification passes, the server generates a cookie for the client to pass authentication.
4. The server starts proxying the now authenticated client traffic to the server with WAF filtering enabled.

## [Usage](https://github.com/RuiSiang/PoW-Shield/blob/main/USAGE.md)

nodejs > 16 and docker > 20

## [Configuration](https://github.com/RuiSiang/PoW-Shield/blob/main/CONFIGURE.md)

environment variables

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

## References
+ Proof-of-work by Fedor Indutny (PoW utility functions)
+ Shadowd by Zesecure (WAF rules)

## License
MIT
