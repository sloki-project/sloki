const tap = require('../tap');
const use = require('abrequire');
const endpoint = require('../endpoints').tcp;
const commandsList = use('src/commands').list;
const Client = use('src/Client');

let tcpClient = new Client(endpoint);

tap.test(
    __filename,
    {timeout:500},
    (t) => {
        tcpClient
            .connect()
            .then((err) => {
                t.deepEqual(err, undefined, 'connect should not return an error');

                t.test(
                    "showCommands",
                    (tShowCommands)  => {
                        tcpClient.showCommands((err, result) => {
                            tShowCommands.deepEqual(err, undefined, 'command should not return an error');

                            // example
                            // [ 'getMaxClients', 'quit', 'setMaxClients', ... ]
                            tShowCommands.deepEqual(
                                result,
                                Object.keys(commandsList),
                                "should return all available commands"
                            );
                            tShowCommands.end();
                            t.end();
                            process.exit(0);
                        });
                    }
                )
            })
    }
);
