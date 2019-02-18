require('./client')(__filename, (test, client, end) => {
    test.test('methods', (subtest)  => {
        client.methods((err, result) => {
            subtest.ok(Object.keys(result).length>5, 'method return at least 10 methods');
            subtest.end();
            end();
        });
    });
});
