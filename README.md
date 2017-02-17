# acclimate

_API-Curious Command-Line Interface Making API Traversal Easy_

A tool to interactively investigate and work with RESTful APIs.

## Getting Started

This project is pre-alpha. Not much to see yet. :)

### Installing

Clone the project and run `npm link` in the project root to add the `acclimate` and `acc`
executables to your path.

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

I plan to use [SemVer](http://semver.org/) for versioning.

## Authors

* **Kelly Fox** - *Initial work* - [kfox](https://github.com/kfox)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Inspired by [httpie](https://httpie.org/), a command line HTTP client with an intuitive UI,
JSON support, syntax highlighting, wget-like downloads, extensions, and more.
