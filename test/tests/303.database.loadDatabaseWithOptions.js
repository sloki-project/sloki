const dbName = '__testUseWithOptions_'+Date.now();

require('./client')(__filename, (test, client) => {
    test.test('loadDatabase', (subtest)  => {
        client.loadDatabase({ database:dbName, options:{ autosave:false } }, (err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.deepEqual(typeof result, 'object', 'should return database properties');
            subtest.deepEqual(result.autosave, false, 'autosave should be false');
            subtest.end();
        });
    });

});
