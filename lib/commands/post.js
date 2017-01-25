// post.js

const RequestHandler = require('../request')

const PostCommand = class {
  add (vorpal) {
    vorpal
      .command('post [url]')
      .option('-h, --headers', 'Additional headers, e.g. "name":"value",...')
      .option('-t, --token', 'API access token')
      .description('Execute HTTP POST on API endpoint')
      .action((args, callback) => {
        const options = {
          headers: args.options.headers,
          method: 'post',
          token: args.options.token,
          url: args.url
        }

        let request = new RequestHandler(options)

        request
          .then(response => {
            if (args.options.verbose) {
              this.log(response.raw)
            } else {
              this.log(response.formatted)
            }
          })
          .catch(err => {
            this.log(err.message)
          })

        callback()
      })
  }
}

module.exports = new PostCommand()
