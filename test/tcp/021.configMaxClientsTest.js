const net = require('net');
const ENV = require('../../src/env');
const rl = require('readline');
const tap = require('tap');


let maxClients = 1;

function run(callback) {

    let client = new net.Socket();
    let client1 = new net.Socket();
    let client2 = new net.Socket();
    let client3 = new net.Socket();

    let lineReader = rl.createInterface(client, client);

    tap.test(
        "connect",
        {timeout:200},
        (t) => {
            client.connect(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST, (err) => {
                //t.comment('connected');
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

            //t.comment('sending set maxClients '+maxClients);
            client.write("set maxClients "+maxClients);

            lineReader.on('line', (line) => {
                //t.comment("received "+line);
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
                                st.end();
                            });

                            //t.comment('sending get maxClients');

                            client.write("get maxClients");
                        }
                    )

                    t.test(
                        "connect client 1",
                        {timeout:200},
                        (st1) => {
                            client1.connect(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST, (err) => {
                                //st1.comment('connected');
                                st1.same(err, null,'err should be null');
                                st1.end();
                            });

                            client1.on('error', (err) => {
                                st1.comment(err);
                                st1.end();
                            })
                        }
                    )

                    t.test(
                        "connect client 2",
                        {timeout:1000},
                        (st2) => {
                            client2.connect(ENV.NET_TCP_PORT, ENV.NET_TCP_HOST, (err) => {
                                //st2.comment('connected');
                                st2.same(err, null,'err should be null');
                            });

                            let lineReader2 = rl.createInterface({
                                input:client2,
                                output:client2,
                                crlfDelay: Infinity
                            });

                            lineReader2.on('line', (line) => {
                                st2.comment('received '+line);
                                st2.equal(line, 'EMAX_CLIENT_REACHED', 'EMAX_CLIENT_REACHED');
                                lineReader2.close();
                                client2.end();
                                client1.end();
                                client.end();
                                st2.end();
                                t.end();
                                callback();

                                //if (line === "")
                            });

                            client2.on('error', (err) => {
                                st2.comment(err);
                                st2.end();
                            })
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
