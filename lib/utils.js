// utils.js

const url = require('url')

const beautifyJs = require('js-beautify')
const beautifyHtml = require('js-beautify').html
const highlight = require('cardinal').highlight
const jqTheme = require('cardinal/themes/jq')

const colors = require('./defaults').colors
const config = require('./config')

const Utils = class {
  static isJson (str) {
    try {
      const json = JSON.parse(str)
      if (json && Utils.isObject(json)) return true
    } catch (e) {
      return false
    }
  }

  static promptString () {
    return colors.prompt('acclimate: ') +
      colors.path(config.get('path')) +
      colors.prompt('>')
  }

  static flatten (x) {
    return Array.isArray(x) ? [].concat(...x.map(Utils.flatten)) : x
  }

  static _stripSlashes (string) {
    return string.replace(/^\/|\/$/g, '')
  }

  static getApiUrl (path = '') {
    let basePath = this._stripSlashes(config.get('path'))
    let pathParts = []
    let separator = ''

    if (path.startsWith('/')) {
      path = this._stripSlashes(path)
    } else {
      if (basePath.length) pathParts.push(basePath)
      if (path.length) pathParts.push(path)
      path = pathParts.join('/')
    }

    if (path.length) separator = '/'

    return url.resolve(
      url.format(config.get('url')) + separator, path
    )
  }

  static prettyPrint (data) {
    const prettyPrintconfig = {
      indent_size: 2,
      wrap_line_length: 72
    }

    if (Utils.isJson(data)) {
      return highlight(
        beautifyJs(
          JSON.stringify(JSON.parse(data), null, '  '),
          prettyPrintconfig
        ), { theme: jqTheme }
      )
    }

    data = data.replace(/^"|"$/g, '')
    return colors.html(
      beautifyHtml(data, prettyPrintconfig)
    )
  }

  static objIsType (obj, type) {
    return (Object.prototype.toString.call(obj) === '[object ' + type + ']')
  }

  static isArray (obj) {
    return Utils.objIsType(obj, 'Array')
  }

  static isObject (obj) {
    return Utils.objIsType(obj, 'Object')
  }

  static isString (obj) {
    return Utils.objIsType(obj, 'String')
  }

  static isFunction (obj) {
    return Utils.objIsType(obj, 'Function')
  }
}

module.exports = Utils
