let dbName = "__testListCollection";

require('./client')(__filename, (test, client) => {
    test.test("loadDatabase", (subtest)  => {
        client.loadDatabase(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.ok(typeof result, "object", "should return database properties");
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
