#!/usr/bin/env node

// acclimate
// API-Curious Command-Line Interface Making API Traversal Easy

// vorpal

const vorpal = require('vorpal')()
const less = require('vorpal-less')
const use = require('vorpal-use')
const grep = require('vorpal-grep')
const repl = require('vorpal-repl')

// acclimate libs

const config = require('../lib/config')
const utils = require('../lib/utils')

// main

config.init()

vorpal
  .use(use)
  .use(grep)
  .use(less)
  .use(repl)
  .delimiter(utils.promptString())
  .history('acclimate')
  .show()
  .parse(process.argv)

require('../lib/commands')(vorpal)
