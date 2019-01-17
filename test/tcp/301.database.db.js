require('./client')(__filename, (test, client) => {
    test.test("db", (subtest)  => {
        client.db((err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, "test", "current database should be 'test'");
            subtest.end();
        });
    });
});
