module.exports = {
  launch: {
    dumpio: true,
    headless: true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox'],
  },
  browser: 'chromium',
  browserContext: 'default',
  server: {
    allowExistingServer: true,
    command: 'npm run build && npm run start',
    port: 3000,
    launchTimeout: 300000,
  },
}
