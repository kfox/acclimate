// token.js

const config = require('../config')

const TokenCommand = class {
  add (vorpal) {
    vorpal
      .command('token [token]')
      .description('Get or set API access token')
      .action(function (args, callback) {
        if (args.token) {
          config.set('token', args.token)
        } else {
          this.log(config.get('token'))
        }
        callback()
      })
  }
}

module.exports = new TokenCommand()
