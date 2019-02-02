let dbName = "__testListCollection";

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        test.test("listCollections", (subtest)  => {
            client.listCollections((err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                subtest.deepEqual(result, [], "should return empty array");
                subtest.end();
            });
        });
    });
});
