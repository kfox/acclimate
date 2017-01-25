const test = require('ava')
const nock = require('nock')

const RequestHandler = require('../lib/request')
const config = require('../lib/config')

const fakeEndpoint = 'https://api.example.com/v1/'

let localErrorResponse = {
  error: {
    message: 'connect ECONNREFUSED 127.0.0.1:80',
    code: 'ECONNREFUSED',
    errno: 'ECONNREFUSED',
    syscall: 'connect',
    address: '127.0.0.1',
    port: 80
  }
}

test.beforeEach(t => {
  config.init()
})

test('with no arguments', t => {
  let request = new RequestHandler()

  request.then(response => {
    t.deepEqual(
      response,
      localErrorResponse,
      'returns an error response'
    )
  })
})

test('GET http://localhost/', t => {
  let request = new RequestHandler({ method: 'get' })

  request.then(response => {
    t.deepEqual(
      response,
      localErrorResponse,
      'returns an error response'
    )
  })
})

test('unknown method', t => {
  let request = new RequestHandler({ method: 'foo' })
  request.catch(err => {
    t.is(
      err,
      'Invalid HTTP method: "foo"',
      'throws an error'
    )
  })
})

test('empty method string', t => {
  let request = new RequestHandler({ method: '' })
  request.catch(err => {
    t.is(
      err,
      'Invalid HTTP method: "undefined"',
      'throws an error'
    )
  })
})

test('options.token missing', t => {
  let scope = nock(fakeEndpoint, { badheaders: 'x-auth-token' })
    .get('/')
    .reply(401)

  let request = new RequestHandler({
    url: fakeEndpoint
  })

  request.then(response => {
    t.true(scope.isDone(), 'expected request was received')
    t.is(
      response.statusCode, 401, 'x-auth-token header was not set'
    )
  })
})

test('options.token', t => {
  let scope = nock(fakeEndpoint)
    .matchHeader('x-auth-token', '1234567890ABCDEF')
    .get('/')
    .reply(200)

  let request = new RequestHandler({
    token: '1234567890ABCDEF',
    url: fakeEndpoint
  })

  request.then(response => {
    t.true(scope.isDone(), 'expected request was received')
    t.is(
      response.statusCode, 200, 'x-auth-token header was set'
    )
  })
})

test('custom headers', t => {
  let scope = nock(fakeEndpoint)
    .matchHeader('x-flurble-gerbil', 'foo')
    .get('/')
    .reply(200)

  let request = new RequestHandler({
    set: { 'x-flurble-gerbil': 'foo' },
    url: fakeEndpoint
  })

  request.then(response => {
    t.true(scope.isDone(), 'expected request was received')
    t.is(
      response.statusCode, 200, 'custom header was set'
    )
  })
})

test('bad request option', t => {
  let request = new RequestHandler({ squid: 'frill' })

  request.catch(err => {
    t.is(
      err.message,
      'Bad request option: squid, value: "frill"',
      'throws an error'
    )
  })
})

test('sample authentication flow', t => {
  const credentials = {
    username: 'test',
    password: 'asdfasdf'
  }

  const responseBody = { foo: 'bar' }

  let scope = nock(fakeEndpoint)
    .post('/auth/me', credentials)
    .reply(200, responseBody)

  let request = new RequestHandler({
    send: credentials,
    method: 'post',
    type: 'form',
    url: fakeEndpoint + 'auth/me'
  })

  request.then(response => {
    t.true(scope.isDone(), 'expected request was received')
    t.is(
      response.statusCode, 200, 'authentication was successful'
    )
    t.deepEqual(
      response.body, responseBody, 'response body was populated'
    )
  })
})

test('ignore undefined or null options', t => {
  let scope = nock(fakeEndpoint)
    .get('/')
    .reply(200)

  let request = new RequestHandler({
    method: 'get',
    foo: undefined,
    bar: null,
    url: fakeEndpoint
  })

  request.then(response => {
    t.true(scope.isDone(), 'expected request was received')
    t.is(
      response.statusCode, 200, 'still works'
    )
  })
})

