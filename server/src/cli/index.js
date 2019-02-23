const argv = require('minimist')(process.argv.slice(2));
const Client = require('sloki-node-client');
const run = require('./run');


if (process.env.DEV) {
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
}

if (!argv._[0]) {
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
