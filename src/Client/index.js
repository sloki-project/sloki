const ENV = require('../env');

let proto;
let host;
let port;

const implementedProtocols = ['tcp','tls'];

function Client(url) {
    let client;
    let e = url.match(/^([^:]+)/);
    if (!e) {
        throw new Error('URL must start with ' + implementedProtocols.join(',')+'');
        process.exit(-1);
        return;
    }

    if (e) {
        proto = e[1].toLowerCase();
        if (implementedProtocols.indexOf(proto)<0) {
            throw new Error('URL does not contain any implemented protocol (' + implementedProtocols.join(',')+')');
            return null;
        }
    }

    if (proto === "https" || proto === "http" || proto === "tls") {
        throw new Error('Protocol '+proto+' not yet implemented');
        process.exit(-1);
    }

    if (proto === "tcp" || proto === "tls") {
        url = url.replace(/(tcp|tls):\/\//,'').split(':');
        host = url[0];
        port = url[1];

        if (proto === "tcp") {
            const ClientTCP = require('./tcp');
            return new ClientTCP(port, host);
        }

        /*
        if (proto === "tls") {
            const ClientTLS = require('./tls');
            return new require('./tls')(port, host);
        }
        */
    }
}

module.exports = Client;
