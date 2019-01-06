const net = require('net');
const ENV = require('../../src/env');
const rl = require('readline');
const tap = require('tap');


function run(callback) {

    let client = new net.Socket();
    let lineReader = rl.createInterface(client, client);

    tap.test(
        "connect and quit",
        {timeout:200},
        (t) => {

            lineReader.on('line', (line) => {
                t.comment("received "+line);
            });

            client.connect(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST, (err) => {
                t.comment('connected');
                t.same(err, null,'err should be null');
                t.comment('sending quit');
                client.write("quit");
            });

            client.on('close', () => {
                t.pass("connection closed");
                lineReader.close();
                t.end();
                callback();
            });

            client.on('error', (err) => {
                t.comment(err);
            })
        }
    )

}

module.exports = {
    run:run
};
