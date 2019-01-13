const ENV = require('../env');
const ClientTCP = require('./tcp');
const ClientHTTP = require('./http');

function Client(url) {
    let client;
    if (url.match(/^http/)) {
        return new ClientHTTP(url);
    }

    url = url.replace(/tcp:\/\//,'').split(':');
    let host = url[0];
    let port = url[1];
    return new ClientTCP(port, host);
}

module.exports = Client;
