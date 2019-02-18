const readline = require('readline');

function run(client) {

    console.log('connected');

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

    rl.setPrompt('> ');
    rl.prompt();
    rl.on('line', (data) => {

        if (data === 'quit') {
            rl.close();
            client.quit();
            return;
        }

        const method = data;
        if (client[method]) {
            client[method]((err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(JSON.stringify(result, null, 2));
                }
                rl.prompt();
            });
            return;
        }

        rl.prompt();
    });


}

module.exports = run;
