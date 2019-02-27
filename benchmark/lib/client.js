let Client;

if (process.env.NODE_ENV === 'dev') {
    Client = require('../../../sloki-node-client');
} else {
    Client = require('sloki-node-client');
}

module.exports = Client;
