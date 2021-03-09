# PoW Shield
Project dedicated to provide DDoS protection with proof-of-work

![screenshot](screenshot.jpg)
## Description
PoW Shield provides DDoS protection on OSI application layer by acting as a proxy between the backend service and the end user. This project aims to provide an alternative to general captcha methods such as Google's ReCaptcha that has always been a pain to solve. Accessing a web service protected by PoW Shield has never been easier, simply to to the url, and your browser will do the rest of the work for you.

## Usage
github repo
```
#clone repo first
npm install
npm start
```
dockerhub (work in progress)

## TODOs
- [x] Web Service Structure
- [x] Proxy Functionality
- [x] PoW Implementation
- [ ] WAF Implementation
- [ ] IP Blacklisting
- [ ] Unit Tests
- [ ] Docker Image
- [ ] Multi-Instance Syncing