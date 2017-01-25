// login.js

const RequestHandler = require('../request')
const config = require('../config')
const utils = require('../utils')

const LoginCommand = class {
  add (vorpal) {
    vorpal
      .command('login [username]')
      .option('-v, --verbose', 'Increase verbosity')
      .description('Authenticate to the API')
      .action(function (args, callback) {
        const self = this

        let username = config.get('username')
        let password
        let prompts = []

        if (!args.username) {
          if (!username) {
            prompts.push({
              name: 'username',
              message: 'Username: '
            })
          }
        } else {
          username = args.username
        }

        prompts.push({
          type: 'password',
          name: 'password',
          message: 'Password: '
        })

        return this
          .prompt(prompts)
          .then(result => {
            if (!username) {
              username = result.username
            }
            password = result.password

            if (!username || !password) {
              self.log('Login aborted.')
              callback()
            } else {
              const options = {
                type: 'form',
                send: {
                  'username': username,
                  'password': password,
                  'grant_type': 'password',
                  'persistent_cookie': 'yes',
                  'client_id': 'INSERT_CLIENT_ID_HERE'
                },
                method: 'post',
                url: '/auth/token'
              }

              let request = new RequestHandler(options)

              config.set('username', username)

              request
                .then(response => {
                  if (args.options.verbose) {
                    self.log(response)
                  } else {
                    self.log(utils.prettyPrint(
                      JSON.stringify(response.body, null, '  ')
                    ))
                  }
                  if (response.body.access_token) {
                    config.set('token', response.body.access_token)
                  }
                })
                .catch(err => {
                  self.log(err.message)
                })
            }
          })
      })
  }
}

module.exports = new LoginCommand()
