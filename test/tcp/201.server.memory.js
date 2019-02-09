require('./client')(__filename, (test, client) => {
    test.test('memory', (subtest)  => {
        client.memory((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');

            // example
            // { rss: '34.7 MB', heapTotal: '18.2 MB', heapUsed: '13.3 MB', external: '2.39 MB' }

            subtest.equal(typeof result.rss, 'string', 'rss should be a string');
            subtest.equal(typeof result.heapTotal, 'string', 'heapTotal should be a string');
            subtest.equal(typeof result.heapUsed, 'string', 'heapUsed should be a string');
            subtest.equal(typeof result.external, 'string', 'external should be a string');
            subtest.end();
        });
    });
});
