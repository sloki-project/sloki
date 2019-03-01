const Bench = require('../lib/Bench');
const async = require('async');
const collectionName = 'i';

class Test extends Bench {

    constructor() {
        super();
        this.title = 'insert#callback.sret.01';
    }

    bench(client, callback) {

        this.client = client;
        this.callback = callback;

        this.start(this);

        async.each(
            this.data,
            (item, next) => {
                client.insert({ c:collectionName, d:item }, { sret:'01' }, (err) => {
                    if (err) throw err;
                    next();
                });
            },
            () => {
                this.stop(this, callback);
            }
        );
    }
}


module.exports = new Test();

if (module.filename === require.main.filename) {
    Test.bench();
}
