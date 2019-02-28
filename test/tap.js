const tapSpec = require('tap-spec');

module.exports = require('tape');

module.exports.createStream()
    .pipe(tapSpec())
    .pipe(process.stdout);

module.exports.onFailure(() => {
    process.exit(255);
});
