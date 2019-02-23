const implementedTransports = [
    'tcp',      // alias for binary
    'tls',      // alias for binarys
    'binary',
    'binarys',
    'jsonrpc',
    'jsonrpcs'
];

function Client(url, options) {

    if (!url) {
        throw new Error('no endpoint specified (i.e tcp://localhost)');
    }

    const e = url.match(/^([^:]+)/);
    if (!e) {
        throw new Error(`endpoint must start with ${implementedTransports.join(',')}`);
    }

    options = options||{};

    options.protocol = e[1].toLowerCase();
    if (implementedTransports.indexOf(options.protocol)<0) {
        throw new Error(`endpoint does not contain any implemented protocol ${implementedTransports.join(',')}`);
    }

    if (options.protocol === 'tcp') {
        options.protocol = 'binary';
    }

    if (options.protocol === 'tls') {
        options.protocol = 'binarys';
    }

    url = url.replace(/^[^:]+:\/\//, '').split(':');
    const host = url[0];
    const port = parseInt(url[1]);

    let MyClient;

    if (options.protocol.match(/jsonrpc/)) {
        MyClient = require('./src/jsonrpc');
    } else if (options.protocol.match(/binary/)) {
        MyClient = require('./src/binary');
    } else {
        throw new Error(`Unknow protocol ${options.protocol}`);
    }

    return new MyClient(port, host, options);

}

module.exports = Client;
