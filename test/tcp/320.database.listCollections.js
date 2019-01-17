let dbName = "__testListCollection";

require('./client')(__filename, (test, client) => {
    test.test("use", (subtest)  => {
        client.use(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
            subtest.end();
        });
    });

    test.test("listCollections", (subtest)  => {
        client.listCollections((err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, [], "should return empty array");
            subtest.end();
        });
    });
});
