module.exports = {
  session_key: 'abcdefghijklmnop', // secret key for session signatures, use a unique one for security
  waf: true, // enable waf function, true=on / false=off
  pow: true, // enable pow function, true=on / false=off
  nonce_validity: 60000, // restricts time limit that a nonce can be submitted to the server after produced
  initial_difficulty: 13, // number of heading 0 bits in produced hash (0:extremely easy ~ 256:impossible, 13:about 5 seconds )
  backend_url: 'http://example.com', // server to proxy traffic to after authorization passed
}
