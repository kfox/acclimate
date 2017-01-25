// cd.js

const stripAnsi = require('strip-ansi')

const config = require('../config')
const utils = require('../utils')

const CdCommand = class {
  add (vorpal) {
    const changePath = (oldPath, newPath) => {
      newPath = newPath.trim()
      var components = newPath.startsWith('/') ? [] : oldPath.split('/').slice(1)

      newPath.split('/').forEach(component => {
        component === '..' ? components.pop() : components.push(component)
      })

      if (components[0] !== '') {
        components.unshift('')
      }

      return components.join('/') || '/'
    }

    const getPathOptions = callback => {
      // TODO: make this for realz
      callback([ 'studios', 'users' ])
    }

    vorpal
      .command('cd [path]')
      .alias([ 'go', 'path' ])
      .description('Change the path appended to the API endpoint')
      .autocomplete({
        data: (input, callback) => {
          getPathOptions(array => {
            callback(array)
          })
        }
      })
      .action(function (args, callback) {
        if (args.stdin && args.stdin[0]) {
          args.path = stripAnsi(args.stdin[0])
        } else if (!args.path) {
          args.path = '/'
        }

        config.set('path', changePath(config.get('path'), args.path))
        vorpal.ui.delimiter(utils.promptString() + ' ')
        vorpal.delimiter(utils.promptString())

        callback()
      })
  }
}

module.exports = new CdCommand()
