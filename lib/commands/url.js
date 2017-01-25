// url.js

const url = require('url')

const config = require('../config')
const utils = require('../utils')

const UrlCommand = class {
  add (vorpal) {
    vorpal
      .command('url [url]')
      .alias([ 'api', 'site' ])
      .description('Get or set API endpoint')
      .action(function (args, callback) {
        if (args.url) {
          config.set('url', url.parse(args.url))
          vorpal.delimiter(utils.promptString())
        } else {
          this.log(url.format(config.get('url')))
        }
        callback()
      })
  }
}

module.exports = new UrlCommand()
