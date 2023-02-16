#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

JSON schema based validation for express routes. Validate req.body declaratively using [JSON schemas](http://json-schema.org/). Uses [tv4](https://github.com/geraintluff/tv4) to create body validation middelware.

## Install

```sh
$ npm install --save body-schema
```

## Usage

```js
var bodySchema = require('body-schema');

var loginSchema = {
    'type': 'object',
    'properties': {
        'username': {
            'type': 'string'
        },
        'password': {
            'type': 'string'
        }
    },
    'required': ['username', 'password']
};

app.post('/login', bodySchema(loginSchema), login);
```

## License

MIT © [Andrew Lavers]()


[npm-image]: https://badge.fury.io/js/body-schema.svg
[npm-url]: https://npmjs.org/package/body-schema
[travis-image]: https://travis-ci.org/alavers/body-schema.svg?branch=master
[travis-url]: https://travis-ci.org/alavers/body-schema
[daviddm-image]: https://david-dm.org/alavers/body-schema.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alavers/body-schema
