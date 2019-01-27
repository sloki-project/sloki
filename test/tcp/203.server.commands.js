require('./client')(__filename, (test, client) => {
    test.test("commands", (subtest)  => {
        client.commands((err, result) => {
            subtest.ok(Object.keys(result).length>5, "should return at least 10 commands");
            subtest.end();
        });
    });
});
