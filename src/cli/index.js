const argv = require('minimist')(process.argv.slice(2));
const Client = require('sloki-node-client');
const run = require('./run');

if (!argv._[0]) {
    require('./usage');
    process.exit(-1);
}

const client = new Client(argv._[0]);

client
    .connect()
    .then(() => {
        run(client);
    });

client.on('error', (err) => {
    throw Error(err);
});
