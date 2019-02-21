const log = require('evillogger')({ ns:'ssl' });
const path = require('path');
const selfsigned = require('selfsigned');
const fs = require('fs-extra');
const config = require('./config');

const certPath = path.resolve(config.SLOKI_DIR+'/certs');
const serverPrivateKeyFile = certPath+'/server.key.pem';
const serverCertificateFile = certPath+'/server.cert.pem';
const serverCAFile = certPath+'/server.public.pem';
const clientPrivateKeyFile = certPath+'/client.key.pem';
const clientPublicFile = certPath+'/client.public.pem';
const clientCertificateFile = certPath+'/client.cert.pem';

function generateCertificates() {

    const attrs = [{
        name: 'commonName', value: 'sloki'
    }];

    const options = {
        days:3650,
        clientCertificate: true,
        clientCertificateCN: 'sloki-client'
    };

    log.info('generating SSL certificates ...');

    const pems = selfsigned.generate(attrs, options);

    fs.outputFileSync(serverPrivateKeyFile, pems.private);
    fs.outputFileSync(serverCertificateFile, pems.cert);
    fs.outputFileSync(serverCAFile, pems.public);
    fs.outputFileSync(clientPrivateKeyFile, pems.clientprivate);
    fs.outputFileSync(clientPublicFile, pems.clientpublic);
    fs.outputFileSync(clientCertificateFile, pems.clientcert);
}

function readCertificates() {

    log.info('reading SSL certificates ...');

    config.SSL_PRIVATE_KEY = fs.readFileSync(serverPrivateKeyFile);
    config.SSL_CERTIFICATE = fs.readFileSync(serverCertificateFile);
    config.SSL_CA = fs.readFileSync(serverCAFile);
}

function check(callback) {

    if (!fs.pathExistsSync(certPath)) {
        fs.ensureDirSync(certPath);
        log.info(`directory ${certPath} created`);
    }

    if (!fs.pathExistsSync(serverPrivateKeyFile)) {
        generateCertificates();
    }

    readCertificates();

    callback();
}

module.exports = { check };
