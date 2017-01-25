const test = require('ava')
const sinon = require('sinon')
const os = require('os')
const fs = require('fs')
const path = require('path')
const url = require('url')

let sandbox
let SESSION_FILE

const config = require('../lib/config')

const BASE_CONFIG = {
  path: '/',
  token: '',
  url: url.parse('http://localhost/'),
  username: process.env.USER
}

test.beforeEach(t => {
  config.init()
  SESSION_FILE = path.resolve(
    os.homedir(),
    '.acclimate',
    config.get('url.hostname'),
    config.get('username'),
    'session.json'
  )
  sandbox = sinon.sandbox.create()
})

test.afterEach(t => {
  sandbox.restore()
})

test('config.get with no arguments', t => {
  t.deepEqual(
    config.get(),
    BASE_CONFIG,
    'outputs the entire config'
  )
})

test('config.init', t => {
  t.is(
    url.format(config.get('url')),
    'http://localhost/',
    'URL is initialized correctly'
  )
  t.is(
    config.get('path'),
    '/',
    'path is initialized correctly'
  )
  t.is(
    config.get('username'),
    process.env.USER,
    'username is initialized correctly'
  )
})

test('config.set', t => {
  const saveSession = sinon.stub(config, 'saveSession')
  const loadSession = sinon.stub(config, 'loadSession')

  config.set('path', '/newpath')
  t.is(
    config.get('path'),
    '/newpath',
    'values are set correctly'
  )
  t.true(
    saveSession.called,
    'config.saveSession was called for config change'
  )
  t.true(
    loadSession.notCalled,
    'config.loadSession was not called for config change'
  )

  config.set('url', 'https://api.example.com/v1')
  t.true(
    loadSession.called,
    'config.loadSession was called when URL set'
  )

  config.set('some.new.variable', 'foobar')
  t.is(
    config.get('some.new.variable'),
    'foobar',
    'config properties are created dynamically'
  )

  config.set('some.new.variable')
  t.is(
    config.get('some.new.variable'),
    '',
    'config properties can be removed'
  )

  saveSession.restore()
  loadSession.restore()
})

test('config.configFile', t => {
  t.is(
    config._configFileName('session'),
    SESSION_FILE,
    'filename is correct'
  )
})

test('config.loadConfigFromFile', t => {
  let accessSyncError = false

  sandbox.stub(fs, 'accessSync', path => {
    if (path === 'non-existent-file.json') {
      accessSyncError = true
      throw new Error('foo')
    } else {
      return
    }
  })

  // eslint-disable-next-line
  sandbox.stub(fs, 'readFileSync', (file, options) => {
    return JSON.stringify({
      path: '/newpath',
      username: 'bob'
    })
  })

  config.loadConfigFromFile(SESSION_FILE)
  t.is(
    config.get('username'),
    'bob',
    'session overwrites existing username'
  )
  t.is(
    config.get('path'),
    '/newpath',
    'session overwrites existing path'
  )
  t.false(
    accessSyncError,
    'loads session file correctly'
  )

  config.loadConfigFromFile('non-existent-file.json')
  t.true(
    accessSyncError,
    'does not load non-existent file'
  )
})

test('config.saveConfigToFile', t => {
  let writtenFile
  let deepDirPath = []

  // eslint-disable-next-line
  sandbox.stub(fs, 'statSync', path => {
    if (path === '/deep' || path === '/deep/dir') {
      throw new Error('foo')
    } else {
      return { isDirectory: () => true }
    }
  })

  // eslint-disable-next-line
  sandbox.stub(fs, 'writeFileSync', (file, data, options) => {
    writtenFile = file
  })

  // eslint-disable-next-line
  sandbox.stub(fs, 'mkdirSync', file => {
    deepDirPath.push(file)
  })

  config.saveConfigToFile(SESSION_FILE)
  t.is(
    writtenFile,
    SESSION_FILE,
    'writes the correct file'
  )

  config.saveConfigToFile('/deep/dir/path')
  t.deepEqual(
    deepDirPath,
    [ '/deep', '/deep/dir' ],
    'creates new directories if needed'
  )
})

test('config._deepGet', t => {
  t.is(
    config.get('url.hostname'),
    'localhost',
    'deep config properties are read properly'
  )
  t.is(
    config.get('url.hostname.bob'),
    '',
    'non-existent properties return empty values'
  )
  t.is(
    config.get(123),
    '',
    'non-string properties return empty values'
  )
})

test('config.loadSession', t => {
  let configFile = null
  sandbox.stub(config, 'loadConfigFromFile', file => {
    configFile = file
    return
  })

  config.loadSession()
  t.is(
    configFile,
    SESSION_FILE,
    'loads the config from a file'
  )
})

test('config.saveSession', t => {
  let configFile = null
  sandbox.stub(config, 'saveConfigToFile', file => {
    configFile = file
    return
  })

  config.saveSession()
  t.is(
    configFile,
    SESSION_FILE,
    'writes the config to a file'
  )
})
