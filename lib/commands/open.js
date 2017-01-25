// open.js

const stripAnsi = require('strip-ansi')

const spawn = require('child_process').spawn
const utils = require('../utils')

const OpenCommand = class {
  add (vorpal) {
    vorpal
      .command('open [url]')
      .description('Open the given URL in your browser')
      .action(function (args, callback) {
        const openCommand = {
          darwin: 'open',
          linux: 'xdg-open',
          win32: 'explorer.exe'
        }

        let url = args.url

        if (args.stdin && args.stdin[0]) {
          const pipedUrl = stripAnsi(args.stdin[0])

          if (args.url) {
            url = [ args.url, pipedUrl ].join('/')
          } else {
            url = pipedUrl
          }
        }

        spawn(openCommand[process.platform], [utils.getApiUrl(url)])

        callback()
      })
  }
}

module.exports = new OpenCommand()
