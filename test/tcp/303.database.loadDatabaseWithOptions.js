let dbName = "__testUseWithOptions_"+Date.now();

require('./client')(__filename, (test, client) => {
    test.test("loadDatabase", (subtest)  => {
        client.loadDatabase(dbName, {autosave:false}, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(typeof result, "object", "should return database properties");
            subtest.deepEqual(result.autosave, false, "autosave should be false");
            subtest.end();
        });
    });

});
