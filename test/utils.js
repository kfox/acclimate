const test = require('ava')
const sinon = require('sinon')
const stripAnsi = require('strip-ansi')

const url = require('url')

const utils = require('../lib/utils')
const config = require('../lib/config')

const objects = {
  'Array': [],
  'Object': {},
  'String': '',
  'Function': () => {}
}

const json = {
  something: {
    widgets: [
      { name: 'one' },
      { name: 'two' }
    ]
  }
}

const html = '<html><body>hello</body></html>'

let sandbox

test.beforeEach(t => {
  sandbox = sinon.sandbox.create()
  config.init()
})

test.afterEach(t => {
  sandbox.restore()
})

test('utils.isArray', t => {
  t.plan(Object.keys(objects).length)
  Object.keys(objects).forEach(type => {
    if (type === 'Array') {
      t.true(utils.isArray(objects[type]), `${type} is an Array`)
    } else {
      t.false(utils.isArray(objects[type]), `${type} is not an Array`)
    }
  })
})

test('utils.isObject', t => {
  t.plan(Object.keys(objects).length)
  Object.keys(objects).forEach(type => {
    if (type === 'Object') {
      t.true(utils.isObject(objects[type]), `${type} is an Object`)
    } else {
      t.false(utils.isObject(objects[type]), `${type} is not an Object`)
    }
  })
})

test('utils.isString', t => {
  t.plan(Object.keys(objects).length)
  Object.keys(objects).forEach(type => {
    if (type === 'String') {
      t.true(utils.isString(objects[type]), `${type} is a String`)
    } else {
      t.false(utils.isString(objects[type]), `${type} is not a String`)
    }
  })
})

test('utils.isFunction', t => {
  t.plan(Object.keys(objects).length)
  Object.keys(objects).forEach(type => {
    if (type === 'Function') {
      t.true(utils.isFunction(objects[type]), `${type} is a Function`)
    } else {
      t.false(utils.isFunction(objects[type]), `${type} is not a Function`)
    }
  })
})

test('utils.objIsType', t => {
  t.plan(Object.keys(objects).length)
  Object.keys(objects).forEach(type => {
    t.true(
      utils.objIsType(objects[type], type),
      `${type} is correctly identified`
    )
  })
})

test('utils.flatten', t => {
  const nestedArray = [[[1, 2], 3], [4, [5, 6], 7]]

  t.true(
    Array.isArray(utils.flatten(nestedArray)),
    'returns an array'
  )
  t.deepEqual(
    [1, 2, 3, 4, 5, 6, 7],
    utils.flatten(nestedArray),
    'should flatten a nested array'
  )
})

test('utils.isJson', t => {
  t.true(
    utils.isJson(JSON.stringify(json)),
    'correctly identifies JSON'
  )
  t.falsy(
    utils.isJson(JSON.stringify(html)),
    'correctly identifies non-JSON'
  )
})

test('utils.promptString', t => {
  t.is(
    stripAnsi(utils.promptString()),
    'acclimate: />',
    'should set the prompt string'
  )
})

test('utils.prettyPrint', t => {
  t.is(
    stripAnsi(utils.prettyPrint(html)),
    '<html>\n\n<body>hello</body>\n\n</html>',
    'pretty-prints HTML'
  )
})

test('utils.getApiUrl', t => {
  sandbox.stub(config, 'saveSession', () => {})
  sandbox.stub(config, 'loadSession', () => {})

  config.set('url', url.parse('https://api.example.com/v1'))
  t.is(
    utils.getApiUrl(),
    'https://api.example.com/v1',
    'gets the defaults API URL'
  )
  t.is(
    utils.getApiUrl('/'),
    'https://api.example.com/v1',
    'gets the root path correctly'
  )
  t.is(
    utils.getApiUrl('/some/other/path'),
    'https://api.example.com/v1/some/other/path',
    'gets a deep path from root'
  )

  config.set('path', '/newpath')
  t.is(
    utils.getApiUrl(),
    'https://api.example.com/v1/newpath',
    'appends the current path with no arguments'
  )
  t.is(
    utils.getApiUrl('subpath'),
    'https://api.example.com/v1/newpath/subpath',
    'appends a subpath to the current path'
  )
  t.is(
    utils.getApiUrl('some/deep/path'),
    'https://api.example.com/v1/newpath/some/deep/path',
    'appends a deep subpath to the current path'
  )
  t.is(
    utils.getApiUrl('/some/other/path'),
    'https://api.example.com/v1/some/other/path',
    'gets a deep path from root even if path is defined'
  )

  config.set('path', 'newpath')
  t.is(
    utils.getApiUrl(),
    'https://api.example.com/v1/newpath',
    'appends the current relative path with no arguments'
  )
})
