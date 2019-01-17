require('./client')(__filename, (test, client) => {
    test.test("memory", (subtest)  => {
        client.clients((err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.equal(result.length, 1, "should return only one connected client");
            subtest.end();
        });
    });
});
