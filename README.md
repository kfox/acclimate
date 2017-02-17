[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com)
[![Build Status](https://travis-ci.org/kfox/acclimate.svg?branch=master)](https://travis-ci.org/kfox/acclimate)
[![Coverage Status](https://coveralls.io/repos/github/kfox/acclimate/badge.svg)](https://coveralls.io/github/kfox/acclimate)

# acclimate

_API-Curious Command-Line Interface Making API Traversal Easy_

## Getting Started

This project is pre-alpha. Not much to see yet. :)

## Prerequisites

`acclimate` uses [yarn](https://yarnpkg.com) to manage dependencies, but
you can use `npm` instead if you don't have yarn (or prefer not to).

## Installing

Clone the project and run:

```
yarn install
npm link
```

## Running the tests

To run the tests and linter:

```
npm test
```

To see code coverage details:

```
npm run coverage
```

## Built With

* [Vorpal](https://github.com/dthree/vorpal) - A Node.js framework for interactive CLI tools
* [Unirest](http://unirest.io/) - A set of lightweight HTTP request client libraries
* [node-jq](https://github.com/sanack/node-jq) - a wrapper for [jq](https://stedolan.github.io/jq/),
  a lightweight and flexible command-line JSON processor

## Versioning

This project uses [SemVer](http://semver.org/) for versioning.

## Authors

* **Kelly Fox** - *Initial work* - [kfox](https://github.com/kfox)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Inspired by [httpie](https://httpie.org/), a command line HTTP client with an intuitive UI,
JSON support, syntax highlighting, wget-like downloads, extensions, and more.
