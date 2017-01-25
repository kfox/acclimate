// filter.js

const stripAnsi = require('strip-ansi')

const jq = require('node-jq').run
const utils = require('../utils')

const FilterCommand = class {
  add (vorpal) {
    vorpal
      .command('filter <expression>')
      .description('Filter JSON output using jq')
      .action(function (args, callback) {
        const self = this
        const options = {
          input: 'string',
          output: 'json'
        }

        let jsonString = ''

        if (args.stdin && args.stdin[0]) {
          jsonString = stripAnsi(args.stdin[0])
        }

        jq(args.expression, jsonString, options)
          .then(output => {
            self.log(utils.prettyPrint(
              JSON.stringify(output, null, '  ')
            ))
          })
          .catch(err => { self.log(err) })

        callback()
      })
  }
}

module.exports = new FilterCommand()
