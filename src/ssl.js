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
        keySize: 1024,
        algorithm: 'sha256',
        //clientCertificate: true,
        //clientCertificateCN: 'sloki-client'
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

function readCertificates(realConfig) {

    log.info('reading SSL certificates ...');

    realConfig.SSL_PRIVATE_KEY = fs.readFileSync(serverPrivateKeyFile);
    realConfig.SSL_CERTIFICATE = fs.readFileSync(serverCertificateFile);
    realConfig.SSL_CA = fs.readFileSync(serverCAFile);
}

function check(realConfig, callback) {

    if (!fs.pathExistsSync(certPath)) {
        fs.ensureDirSync(certPath);
        log.info(`directory ${certPath} created`);
    }

    if (!fs.pathExistsSync(serverPrivateKeyFile)) {
        generateCertificates();
    }

    readCertificates(realConfig);

    callback();
}

module.exports = { check };
