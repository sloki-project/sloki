const tester = 'tape'; // or tap

if (tester === 'tape') {
    const tapSpec = require('tap-spec');

    module.exports = require('tape');

    module.exports.createStream()
        .pipe(tapSpec())
        .pipe(process.stdout);

    module.exports.onFailure(() => {
        process.exit(255);
    });

} else {
    module.exports = require('tap');
}
