const argv = require('minimist')(process.argv.slice(2));
const run = require('./run');

let Client;

if (process.env.NODE_ENV === 'dev') {
    Client = require('../../../sloki-node-client');

    process.on('uncaughtException', function (err) {
        console.log('uncaughtException');
        console.log(err);
    });

    process.on('unhandledRejection', (reason, p) => {
        console.log('unhandledRejection reason');
        console.log(reason);
        console.log('promise');
        console.log(p);
        console.log('stack');
        console.log(reason.stack);
    });

} else {
    Client = require('sloki-node-client');
}


if (!argv._[0]) {
    argv._[0] = 'tcp://localhost';
}

if (argv.help) {
    require('./usage');
    process.exit(-1);
}


(async function() {

    const client = new Client(argv._[0]);

    await client.connect((err) => {
        if (err) {
            console.log(err.message);
            return;
        }
        run(argv._[0], client);
    });

})();
