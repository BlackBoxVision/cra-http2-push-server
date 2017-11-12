# cra-http2-push-server
> :rocket: HTTP2 custom server for CRA projects. Boost your App load times!

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/cra-http2-push-server.svg)](https://badge.fury.io/js/cra-http2-push-server) [![npm downloads](https://img.shields.io/npm/dm/cra-http2-push-server.svg)](https://www.npmjs.com/package/cra-http2-push-server)

[![NPM](https://nodei.co/npm/cra-http2-push-server.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cra-http2-push-server/) [![NPM](https://nodei.co/npm-dl/cra-http2-push-server.png?months=9&height=1)](https://nodei.co/npm/cra-http2-push-server/) 

## Installation

**YARN**

```javascript
yarn add cra-http2-push-server
```

**NPM**

```javascript
npm install --save cra-http2-push-server
```

## Usage

You have to define the following enviroment variables:

```bash 
BUILD_DIR = `Location to the build directory of your create-react-app. It has no default value.`
ADDRESS = `The ip where it will be running, if not passed it will use 'localhost' as default.`
PORT = `The port where it will be exposed, if not passed it will use '8080' as default.`
ENABLE_HTTPS = `true || false. This is necessary for http2 server, to know how it will execute. If 'false' or undefined it will use http for http2.`
CERT_DIR = `If ENABLE_HTTPS is set to 'true', then you have to specify your certificate directory. The server will expect your files to be named like server.crt, server.key, server.csr.`
```
After having this enviromental values defined you then can import the server, and start it: 

```javascript
# index.js
const http2PushServer = require('cra-http2-push-server');

http2PushServer.start();
```

## Issues

If you found a bug, or you have an answer, or whatever. Please, open an [issue](https://github.com/BlackBoxVision/cra-http2-push-server/issues). I will do the best to fix it, or help you.

## Contributing

Of course, if you see something that you want to upgrade from this library, or a bug that needs to be solved, **PRs are welcome!**

## License

Distributed under the **MIT license**. See [LICENSE](https://github.com/BlackBoxVision/cra-http2-push-server/blob/master/LICENSE) for more information.
