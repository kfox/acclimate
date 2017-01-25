// config.js

const defaults = require('../defaults')
const config = require('../config')
const utils = require('../utils')

const ConfigCommand = class {
  static _getOptions () {
    return Object.keys(config.get())
  }

  add (vorpal) {
    vorpal
      .command('config [setting] [value]')
      .option('-u, --unset', 'Remove setting')
      .description('View or change configuration')
      .autocomplete({ data: ConfigCommand._getOptions })
      .action(function (args, callback) {
        const setting = args.setting
        const value = args.value

        if (args.options.unset && setting) {
          if (Object.keys(defaults.config).includes(setting)) {
            this.log(utils.prettyPrint(
              `${setting} can be changed but not removed`
            ))
          } else {
            config.set(setting)
            this.log(utils.prettyPrint(
              JSON.stringify(`Removed ${setting}`)
            ))
          }
        } else {
          if (setting && value) {
            config.set(setting, value)
            this.log(utils.prettyPrint(
              JSON.stringify(`Set ${setting} to '${config.get(setting)}'`)
            ))
          } else {
            this.log(utils.prettyPrint(JSON.stringify(config.get(setting))))
          }
        }

        callback()
      })
  }
}

module.exports = new ConfigCommand()
