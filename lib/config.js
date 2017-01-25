// config.js

const defaults = require('./defaults')

const fs = require('fs')
const os = require('os')
const path = require('path')

const Config = class {
  constructor () {
    this._currentConfig = {}
  }

  static _deepGet (obj, path) {
    if (!path) return obj

    try {
      // eslint-disable-next-line
      return new Function('_', 'return _.' + path)(obj)
    } catch (e) {
      return undefined
    }
  }

  static _deepSet (obj, path, value) {
    var properties = path.split('.')
    properties.reduce((deep, property, index) => {
      if (properties.length - 1 === index) {
        if (value === undefined) {
          delete deep[property]
        } else {
          deep[property] = value
        }
      } else {
        deep[property] = {}
      }
      return deep[property]
    }, obj)

    return obj
  }

  static _mkdirp (path) {
    var fullpath = ''
    path.split('/').slice(1, -1).forEach(dir => {
      fullpath += '/' + dir
      try {
        fs.statSync(fullpath).isDirectory()
      } catch (e) {
        fs.mkdirSync(fullpath)
      }
    })
  }

  init () {
    Object.assign(
      this._currentConfig,
      defaults.config
    )
  }

  get (path) {
    let value = Config._deepGet(this._currentConfig, path) || ''
    return value
  }

  set (item, value) {
    Config._deepSet(this._currentConfig, item, value)

    if (item === 'url') {
      Config._deepSet(this._currentConfig, 'path', '/')
      this.loadSession()
      return
    }

    this.saveSession()
  }

  _configFileName (filename) {
    return path.resolve(
      os.homedir(),
      '.acclimate',
      this.get('url.hostname'),
      this.get('username'),
      filename + '.json'
    )
  }

  loadConfigFromFile (file) {
    try {
      fs.accessSync(file)
    } catch (e) {
      return
    }

    Object.assign(
      this._currentConfig,
      JSON.parse(fs.readFileSync(file))
    )
  }

  saveConfigToFile (file) {
    Config._mkdirp(file)
    fs.writeFileSync(
      file,
      JSON.stringify(this._currentConfig, null, 2) + '\n'
    )
  }

  loadSession () {
    this.loadConfigFromFile(this._configFileName('session'))
  }

  saveSession () {
    this.saveConfigToFile(this._configFileName('session'))
  }
}

module.exports = new Config()
