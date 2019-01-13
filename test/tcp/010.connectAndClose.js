const Client = require('@Client');
const ENV = require('@ENV');
const tap = require('../tap');


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
