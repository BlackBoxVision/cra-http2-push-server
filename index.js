const compression = require('compression');
const Express = require('express');
const helmet = require('helmet');
const http2 = require('spdy');
const fs = require('fs');

class Server {
    static async start() {
        try {
            const address = process.env.ADDRESS || 'localhost';
            const port = parseInt(process.env.PORT, 10) || 8080;
            
            const app = new Express();

            const manifest = JSON.parse(fs.readFileSync(`${process.env.BUILD_DIR}/asset-manifest.json`, 'utf-8'));

            if (!manifest) {
                throw new Error("You've to build the project, please, run `npm run build` or `yarn build`.");
            }

            app.use(helmet());
            app.use(compression({ threshold: 0 }));
            app.use('/static', Express.static(`${process.env.BUILD_DIR}/static`));

            app.get('*', (req, res, next) => {
                res.header('X-Powered-By', null);
                next();
            })

            app.get('/', (req, res) => {
                res.header('Content-Type', 'text/html');
                res.send(fs.readFileSync(`${rocess.env.BUILD_DIR}/index.html`, 'utf-8'));
                res.end();
            });

            let options = null;

            if (process.env.ENABLE_HTTPS === 'true') {
                options = {
                    key: fs.readFileSync(`${process.env.CERT_DIR}/server.key`),
                    cert: fs.readFileSync(`${process.env.CERT_DIR}/server.crt`),
                    ca: fs.readFileSync(`${process.env.CERT_DIR}/server.csr`)
                };
            } else {
                options = {
                    spdy: {
                        plain: true,
                        ssl: false
                    }  
                };
            }

            const http2Server = http2.createServer(options, (req, res) => {
                if (res.push) {
                    console.info('> Pushing ', req.url);

                    let content = [
                        {
                            url: '/', 
                            contentType: 'text/html', 
                            filePath: `${process.env.BUILD_DIR}/index.html`
                        },
                        {
                            url: '/service-worker.js', 
                            contentType: 'application/javascript', 
                            filePath: `${process.env.BUILD_DIR}/service-worker.js`
                        },
                        {
                            url: `/${manifest['main.js']}`, 
                            contentType: 'application/javascript', 
                            filePath: `${process.env.BUILD_DIR}/${manifest['main.js']}`
                        },
                        {
                            url: `/${manifest['main.css']}`, 
                            contentType: 'text/css', 
                            filePath: `${process.env.BUILD_DIR}/${manifest['main.css']}`
                        }
                    ];

                    if (process.env.NODE_ENV !== 'production') {
                        content.push([
                            {
                                url: `/${manifest['main.css.map']}`, 
                                contentType: 'text/css', 
                                filePath: `${process.env.BUILD_DIR}/${manifest['main.css.map']}`
                            },
                            {
                                url: `/${manifest['main.js.map']}`, 
                                contentType: 'application/javascript', 
                                filePath: `${process.env.BUILD_DIR}/${manifest['main.js.map']}`
                            }
                        ])
                    }

                    content.map(({ url, contentType, filePath }) => {
                        const stream = res.push(url, {
                            status: 200,
                            method: "GET",
                            request: { 
                                accept: "*/*" 
                            },
                            response: { 
                                "content-type": contentType 
                            }
                        });
                    
                        stream.on("error", error => console.info(error));
                        stream.end(fs.readFileSync(filePath, 'utf-8'));
                    });
                }

                return app(req, res);
            });
            
            
            http2Server.listen(port, address, error => {
                if (error) {
                    console.info(`> Ups, something went wrong: ${error}`);
                }

                console.info(`> Ready on http://${address}:${port}`);
            });
        } catch (error) {
            console.info(`> Ups, something went wrong: ${error}`);
        }
    }
}

module.exports = Server;