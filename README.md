# PoW Shield

[![nodejs-ci](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml)
[![njsscan sarif](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml)
[![CodeQL](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/ruisiang/pow-shield?color=orange)
[![Docker Image Size (tag)](https://img.shields.io/docker/image-size/ruisiang/pow-shield/latest?label=docker%20image%20size)](https://hub.docker.com/r/ruisiang/pow-shield)
[![](https://images.microbadger.com/badges/version/ruisiang/pow-shield.svg)](https://hub.docker.com/r/ruisiang/pow-shield)

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

nodejs and docker

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

BSD 3-Clause License

Copyright (c) 2021, RuiSiang
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
