// defaults.js

const url = require('url')
const chalk = require('chalk')

const Defaults = function () {}

Defaults.prototype.headers = {
  'x-requested-with': 'XMLHttpRequest',
  'expires': '-1',
  'cache-control': 'no-cache,no-store,must-revalidate,max-age=-1,private'
}

Defaults.prototype.colors = {
  html: chalk.red,
  path: chalk.bold.magenta,
  prompt: chalk.bold.yellow,
  request: chalk.bold.red
}

Defaults.prototype.config = {
  path: '/',
  token: '',
  url: url.parse('http://localhost'),
  username: process.env.USER
}

module.exports = new Defaults()
