require('./client')(__filename, (test, client) => {
    test.test('version', (subtest)  => {
        client.versions((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');

            // example
            // { rss: '34.7 MB', heapTotal: '18.2 MB', heapUsed: '13.3 MB', external: '2.39 MB' }

            subtest.equal(typeof result.sloki, 'string', 'sloki version should be a string');
            subtest.equal(typeof result.lokijs, 'string', 'lokijs version should be a string');
            subtest.end();
        });
    });
});
