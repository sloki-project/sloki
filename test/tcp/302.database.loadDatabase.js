let dbName = "__testUse";

require('./client')(__filename, (test, client) => {
    test.test("loadDatabase", (subtest)  => {
        client.loadDatabase(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.ok(typeof result, "object", "should return database properties");
            subtest.end();
        });
    });

    test.test("db", (subtest)  => {
        client.db((err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
            subtest.end();
        });
    });
});
