// get.js

const stripAnsi = require('strip-ansi')

const RequestHandler = require('../request')
const utils = require('../utils')
const config = require('../config')

const GetCommand = class {
  add (vorpal) {
    vorpal
      .command('get [url]')
      .option('-h, --headers', 'Additional headers, e.g. "name":"value",...')
      .option('-t, --token', 'API access token')
      .option('-v, --verbose', 'Increase verbosity')
      .description('Execute HTTP GET on API endpoint')
      .action(function (args, callback) {
        const self = this
        const options = {
          method: 'get',
          token: args.options.token || config.get('token'),
          url: args.url
        }

        if (args.stdin && args.stdin[0]) {
          const pipedUrl = stripAnsi(args.stdin[0])

          if (args.url) {
            options.url = [ args.url, pipedUrl ].join('/')
          } else {
            options.url = pipedUrl
          }
        }

        if (args.options.headers) {
          options.headers = args.options.headers
        }

        let request = new RequestHandler(options)

        request
          .then(response => {
            if (args.options.verbose) {
              self.log(response)
            } else {
              self.log(utils.prettyPrint(
                JSON.stringify(response.body, null, '  ')
              ))
            }
          })
          .catch(err => {
            self.log(err.message)
          })

        callback()
      })
  }
}

module.exports = new GetCommand()
