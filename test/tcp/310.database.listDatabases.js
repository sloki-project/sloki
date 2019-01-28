require('./client')(__filename, (test, client) => {
    test.test("listDatabases", (subtest)  => {
        client.listDatabases((err, result) => {
            let expected = ['test','__testUse', '__testUseWithOptions'];
            subtest.deepEqual(result, expected, "should return "+JSON.stringify(expected));
            subtest.end();
        });
    });
});
