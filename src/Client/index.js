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

    if (proto === "tcp") {
        url = url.replace(/(tcp|tls):\/\//,'').split(':');
        host = url[0];
        port = url[1];

        if (proto === "tcp") {
            return new require('./tcp')(port, host);
        }

        /*
        if (proto === "tls") {
            return new require('./tls')(port, host);
        }
        */
    }
}

module.exports = Client;
