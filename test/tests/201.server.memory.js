require('./client')(__filename, (test, client, end) => {
    test.test('memory', (subtest)  => {
        client.memory((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.pass(JSON.stringify(result));
            subtest.equal(typeof result.rss, 'string', 'rss should be a string');
            subtest.equal(typeof result.heapTotal, 'string', 'heapTotal should be a string');
            subtest.equal(typeof result.heapUsed, 'string', 'heapUsed should be a string');
            subtest.equal(typeof result.external, 'string', 'external should be a string');
            subtest.end();
            end();
        });
    });
});
