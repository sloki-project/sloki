const readline = require('readline');

function run(url, client) {

    let ctrlC = false;

    console.log(`client connected on ${url}`);

    client.on('close', () => {
        console.log('client disconnected');
        rl.close();
    });

    client.on('error', (err) => {
        console.log(err);
        rl.prompt();
    });

    const completions = client.getMethodsName();

    function autoComplete(line) {
        const hits = completions.filter((c) => c.startsWith(line));
        return [hits.length ? hits : completions, line];
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer:autoComplete
    });

    rl.on('SIGINT', () => {
        if (!ctrlC) {
            console.log();
            console.log('(To exit, press ^C again or type .exit)');
            rl.prompt();
            ctrlC = true;
        } else {
            console.log();
            process.exit();
        }
    });

    rl.setPrompt('> ');
    rl.prompt();
    rl.on('line', data => {

        if (!data) {
            ctrlC = false;
        }

        if (data === 'quit') {
            rl.close();
            client.quit();
            return;
        }

        const method = data;
        if (client[method]) {
            rl.pause();
            client[method]((err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(JSON.stringify(result, null, 2));
                }
                rl.resume();
                rl.prompt();
            });
            return;
        }

        rl.prompt();
    });


}

module.exports = run;
