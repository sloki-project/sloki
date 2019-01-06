const net = require('net');
const ENV = require('../../src/env');
const rl = require('readline');
const tap = require('tap');

function run(callback) {

    let client = new net.Socket();
    let lineReader = rl.createInterface(client, client);

    tap.test(
        "simple TCP connect on "+ENV.NET_TCP_HOST+":"+ENV.NET_TCP_PORT,
        {timeout:200},
        (t) => {

            lineReader.on('line', (line) => {
                t.comment("received "+line);
            });

            client.connect(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST, (err) => {
                t.comment('connected');
                t.same(err, null,'err should be null');
                setTimeout(() => {
                    t.end();
                    client.end();
                    lineReader.close();
                    callback();
                },100);

            });

        }
    )

}

module.exports = {
    run:run
};
