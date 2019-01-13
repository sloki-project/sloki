const tap = require('../tap');
const use = require('abrequire');
const Client = use('src/Client');
const ENV = use('src/env');


let endpoint = 'tcp://'+ENV.NET_TCP_HOST+':'+ENV.NET_TCP_PORT;

tap.test(
    __filename,
    {timeout:200},
    (t) => {
        let myClient = new Client(endpoint);

        myClient
            .connect()
            .then(() => {
                t.pass("connected");
                myClient.close();
                t.end();
                process.exit(0);
            });
    }
);
