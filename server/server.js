const fs        = require('fs');
const express   = require('express');
const argparse  = require('argparse');
const path      = require('path');
const WebSocket = require('ws')
/*
    Basic server for hosting the page
*/

const parser = new argparse.ArgumentParser({
  version : '0.0.1',
  addHelp : true,
  description: 'server'
});

parser.addArgument(
    ['--host' ],
    {
        help: 'hostname',
        defaultValue: '127.0.0.1'
    }
);
parser.addArgument(
    [ '-p', '--port' ],
    {
        help: 'port to listen on',
        defaultValue: 8000
    }
);

parser.addArgument(
    ['-ssl', '--enablessl'],
    {
        help: 'enable SSL for use with HTTPS/certificates',
        defaultValue: false
    }
);

parser.addArgument(
    ['-root', '--rootdir'],
    {
        help: 'set root directory',
        defaultValue: '../'
    }
)

const args       = parser.parseArgs();
const https      = require('https');
const http       = require('http');
const host       = args.host;
const port       = parseInt(args.port);
const systemRoot = args.rootdir;

args.enablessl = true;
console.log("enabled ssl:", args.enablessl);


// currently unused options for SSL
const options = {
  key: ((args.enablessl) ? fs.readFileSync(path.join(__dirname, 'ca.key')) : ''),
  cert: ((args.enablessl) ? fs.readFileSync(path.join(__dirname, 'ca.crt')) : ''),
  requestCert: false,
  rejectUnauthorized: false
};

let app = express();

let frontend = express.static(systemRoot);

app.use(frontend);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = (args.enablessl) ? 
                https.createServer(options, app) : 
                http.createServer({}, app);

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.post('/', function(request, response) {
  console.log('POST /')
  console.dir(request.body)
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end('thanks')
});

if (!args.enablessl) {
    app.listen(port, () => {
        console.log('http server listening on port ' + port);
    });
} else {
    server.listen(4443, () => {
        console.log('https server listening on port ' + server.address().port);
    });
}

const wss = new WebSocket.Server({ port: 4444, server: server, rejectUnauthorized: false, requestCert: false});
console.log("WEE");
wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  ws.send('hi')
})
