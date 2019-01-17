require('./client')(__filename, (test, client) => {
    test.test("commands", (subtest)  => {
        client.listDatabases((err, result) => {
            let expected = ['test','__testUse'];
            subtest.deepEqual(result, expected, "should return "+JSON.stringify(expected));
            subtest.end();
        });
    });
});
