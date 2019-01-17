const use = require('abrequire');
const commandsList = use('src/commands').list;

require('./client')(__filename, (test, client) => {
    test.test("commands", (subtest)  => {
        client.commands((err, result) => {
            subtest.deepEqual(result, Object.keys(commandsList), "should return all available commands");
            subtest.end();
        });
    });
});
