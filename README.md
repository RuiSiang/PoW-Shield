# PoW Shield
[![nodejs-ci](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/nodejs-ci.yml)
[![njsscan sarif](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/njsscan-analysis.yml)
[![CodeQL](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/RuiSiang/PoW-Shield/actions/workflows/codeql-analysis.yml)

Project dedicated to provide DDoS protection with proof-of-work

![screenshot](screenshot.jpg)
## Description
PoW Shield provides DDoS protection on OSI application layer by acting as a proxy between the backend service and the end user. This project aims to provide an alternative to general captcha methods such as Google's ReCaptcha that has always been a pain to solve. Accessing a web service protected by PoW Shield has never been easier, simply go to the url, and your browser will do the rest of the work for you.

[Detailed description and story on Medium](https://ruisiang.medium.com/pow-shield-application-layer-proof-of-work-ddos-filter-4fed32465509 "PoW Shield: Application Layer Proof of Work DDoS Filter") 

## Usage
github repo
```
# clone repo first
npm install
cp .env.example .env
# edit .env
npm run build
npm start
```
dockerhub (work in progress)

## Configuration
+ PORT: port that PoW Shield listens to
+ SESSION_KEY: secret key for cookie signatures, use a unique one for security reasons, or anyone can forge your signed cookies
+ WAF: toggles waf functionality on/off (waf is a work in progress)
+ POW: toggles PoW functionality on/off (if not temporary switched off, why use this project at all?)
+ NONCE_VALIDITY: specifies the maximum time a nonce has to be submitted to the server after generation(used to enforce difficulty change and filter out stale nonces)
+ INITIAL_DIFFICULTY: initial difficulty, number of leading 0-bits in produced hash (0:extremely easy ~ 256:impossible, 13(default):takes about 5 seconds for the browser to calculate)
+ BACKEND_URL: location to proxy authenticated traffic to, IP and URLs are both accepted

## TODOs
- [x] Web Service Structure
- [x] Proxy Functionality
- [x] PoW Implementation
- [ ] WAF Implementation
- [ ] IP Blacklisting
- [ ] Dynamic Difficulty
- [ ] Unit Testing
- [ ] Dockerization
- [ ] Multi-Instance Syncing

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
