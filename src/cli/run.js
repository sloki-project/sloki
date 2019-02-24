const readline = require('historic-readline');
const parseLine = require('./parseLine');
const path = require('path');
const homedir = require('os').homedir();

function run(url, client) {

    let ctrlC = false;
    let prettyJson = false;

    console.log(`client connected on ${url}`);

    const completions = client.getMethodsName();
    completions.push('.pretty');

    function autoComplete(line) {
        const hits = completions.filter((c) => c.startsWith(line));
        return [hits.length ? hits : completions, line];
    }

    readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        path: path.join(homedir, '.sloki_history'),
        maxLength: 100, //Only keep 100 lines worth of history
        completer:autoComplete,
        next:(rl) => {

            client.on('close', () => {
                console.log('client disconnected');
                rl.close();
            });

            client.on('error', (err) => {
                console.log(err);
                rl.prompt();
            });

            rl.on('SIGINT', () => {
                if (!ctrlC) {
                    console.log();
                    console.log('(To exit, press ^C again or type .exit)');
                    rl.prompt();
                    ctrlC = true;
                } else {
                    console.log();
                    rl.close();
                    client.quit();
                }
            });

            rl.setPrompt('> ');
            rl.prompt();
            rl.on('line', line => {

                if (!line) {
                    // reset flag previously setted by hitting Ctrl+C
                    ctrlC = false;
                }

                if (line === 'quit' || line === 'exit') {
                    rl.close();
                    client.quit();
                    return;
                }

                if (line === '.pretty') {
                    if (prettyJson) {
                        prettyJson = false;
                        console.log('JSON will be displayed as a line');
                    } else {
                        prettyJson = true;
                        console.log('JSON will be displayed with indentation and multiple lines');
                    }
                    rl.prompt();
                    return;
                }

                const data = parseLine(line);

                if (client[data.method]) {

                    if (data.args === 'help') {
                        console.log(JSON.stringify(client._methods[data.method], null, 2));
                        rl.prompt();
                        return;
                    }

                    rl.pause();

                    let args;

                    if (data.args) {
                        try {
                            // eval or json.parse, that is the question !
                            // eval permit a simplifier version i.e foo:"bar"
                            // with json.parse, double quote are mandatory i.e "foo":"bar"
                            //args = JSON.parse(data.args);
                            eval('args='+data.args);
                        } catch(e) {
                            console.error(e.message);
                            rl.prompt();
                            return;
                        }
                    }

                    client[data.method](args, (err, result) => {
                        if (err) {
                            if (err.message) {
                                console.log('error:', err.message);
                            } else {
                                console.log('error:', err);
                            }
                        } else {
                            if (prettyJson) {
                                console.log(JSON.stringify(result, null, 2));
                            } else {
                                console.log(JSON.stringify(result));
                            }
                        }
                        rl.resume();
                        rl.prompt();
                    });
                    return;
                } else {
                    console.log(`error: ${data.method} method does not exist`);
                }

                rl.prompt();
            });
        }
    });

}

module.exports = run;
