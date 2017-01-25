// request.js

const request = require('unirest')
const defaults = require('./defaults')
const config = require('./config')
const utils = require('./utils')

let RequestHandler = (function () {
  class RequestHandler {
    constructor (options = {}) {
      const defaultOptions = RequestHandler._getDefaultOptions()

      options = Object.assign({}, defaultOptions, options)
      options.url = utils.getApiUrl(options.url)

      // remove option keys if the values are undefined/null
      Object.keys(options).forEach(option => {
        if (!options[option]) delete options[option]
      })

      if (!RequestHandler._isValidHttpMethod(options.method)) {
        return Promise.reject(`Invalid HTTP method: "${options.method}"`)
      }

      this._request = request

      // TODO: don't assume this will always need to be a header,
      //       e.g. it might be a query string
      if (options.token) {
        options.headers['x-auth-token'] = options.token
      }

      return this._exec(options)
    }

    static _isValidHttpMethod (method) {
      if (!method) return false

      return [
        'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'
      ].includes(method.toUpperCase())
    }

    static _getDefaultOptions () {
      return {
        headers: defaults.headers,
        method: 'get',
        token: config.get('token'),
        url: config.get('path')
      }
    }

    static _getIgnoredOptions () {
      return Object.keys(RequestHandler._getDefaultOptions())
    }

    // static _getValuesFromJson (data) {
    //   let results = []
    //
    //   // TODO: refactor using object literals
    //   // TODO: allow arbitrary values to be gathered from JSON
    //   //       instead of just URLs
    //
    //   if (utils.isArray(data)) {
    //     data.forEach(element => {
    //       results.push(RequestHandler._getValuesFromJson(element))
    //     })
    //   } else if (utils.isObject(data)) {
    //     Object.keys(data).forEach(key => {
    //       results.push(RequestHandler._getValuesFromJson(data[key]))
    //     })
    //   } else if (utils.isString(data)) {
    //     const apiUrl = utils.getApiUrl()
    //     const stripBase = new RegExp('(.*?/){3}')
    //     const pathUrl = apiUrl.replace(stripBase, '/')
    //
    //     if (data.includes(pathUrl)) {
    //       data = data.replace(apiUrl, '')
    //       data = data.replace(pathUrl, '')
    //       return data
    //     }
    //   } else {
    //     return
    //   }
    //
    //   return utils.flatten(results).filter((x) => x !== '')
    // }

    static _replaceErrors (key, value) {
      if (value instanceof Error) {
        let obj = {}

        Object.getOwnPropertyNames(value).forEach(key => {
          if (key === 'stack') return
          obj[key] = value[key]
        })

        return obj
      }

      return value
    }

    _exec (options) {
      const ignoredOptions = RequestHandler._getIgnoredOptions()
      const self = this

      this._request = this._request(
        options.method,
        options.url,
        options.headers
      )

      let promise = new Promise((resolve, reject) => {
        Object.keys(options).forEach(option => {
          if (ignoredOptions.includes(option)) return

          try {
            self._request = self._request[option](options[option])
          } catch (e) {
            reject(
              new Error(`Bad request option: ${option}, ` +
                        `value: "${options[option]}"`)
            )
          }
        })

        self._request = self._request.end(response => {
          try {
            response = response.toJson()
          } catch (e) {
            response = JSON.parse(JSON.stringify(
              response,
              RequestHandler._replaceErrors,
              '  '
            ))
          }

          resolve(response)
        })
      })

      return promise
    }
  }

  return RequestHandler
})()

module.exports = RequestHandler
