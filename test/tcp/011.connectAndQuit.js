const Client = require('@Client');
const ENV = require('@ENV');
const tap = require('../tap');


let endpoint = 'tcp://'+ENV.NET_TCP_HOST+':'+ENV.NET_TCP_PORT;

tap.test(
    __filename,
    {timeout:500},
    (t) => {
        let myClient = new Client(endpoint);

        myClient
            .connect()
            .then(() => {
                t.pass("connected, sending quit");
                try {
                    myClient.quit((err) => {
                        t.pass("disconnected by the server");
                        t.end();
                        process.exit(0);
                    })
                } catch(e) {
                    t.pass(e.message);
                    t.end();
                    process.exit(-1);
                }
            });
    }
);
