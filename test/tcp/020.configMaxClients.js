const net = require('net');
const ENV = require('../../src/env');
const rl = require('readline');

const importFresh = require('import-fresh');
const tap = importFresh('tap');

let maxClients = 2;

function run(callback) {

    let client = new net.Socket();
    let lineReader = rl.createInterface(client, client);

    tap.test(
        "connect",
        {timeout:200},
        (t) => {
            client.connect(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST, (err) => {
                t.comment('connected');
                t.same(err, null,'err should be null');
                setTimeout(t.end, 100);
            });

            client.on('error', (err) => {
                t.comment(err);
            })
        }
    )

    tap.test(
        "set maxClients",
        {timeout:200},
        (t) => {

            t.comment('sending set maxClients '+maxClients);
            client.write("set maxClients "+maxClients);

            lineReader.on('line', (line) => {
                t.comment("received "+line);
                if (line === "> NET_TCP_MAX_CLIENTS is now '"+maxClients+"'") {
                    t.pass("maxClients is now supposed to be "+maxClients+" server side");

                    t.test(
                        "get maxClients",
                        {timeout:200},
                        (st) => {

                            lineReader.on('line', (line) => {
                                st.comment("received "+line);
                                line = line.replace(/[> ]/,'');
                                line = parseInt(line);
                                st.equal(line, maxClients);
                                lineReader.close();
                                client.end();
                                st.end();
                                t.end();
                                callback();
                            });

                            t.comment('sending get maxClients');

                            client.write("get maxClients");
                        }
                    )
                }
            });
        }
    )
}

module.exports = {
    run:run
};
