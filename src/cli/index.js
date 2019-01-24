const argv = require('minimist')(process.argv.slice(2));
const use = require('abrequire');
const Client = use('src/Client');
const readline = require('readline');

if (!argv._[0]) {
    require('./usage');
    process.exit(-1);
}

const client = new Client(argv._[0]);

function onConnected() {
    console.log('connected');
    const completions = 'quit truc bidule bla bli blo'.split(' ');

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
        if (data === "quit") {
            rl.close();
            client.quit();
            return;
        }
        rl.prompt();
    });


}

function onError(err) {
    throw Error(err);
}

client.connect().then(onConnected);
client.on('error',onError);
