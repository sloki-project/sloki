require('./client')(__filename, (test, client, end) => {
    test.test('memory', (subtest)  => {
        client.memory((err, result) => {
            subtest.deepEqual(err, undefined, 'method should not return an error');
            subtest.pass(JSON.stringify(result));
            subtest.equal(typeof result.process.rss, 'string', 'process.rss should be a string');
            subtest.equal(typeof result.process.heapTotal, 'string', 'process.heapTotal should be a string');
            subtest.equal(typeof result.process.heapUsed, 'string', 'process.heapUsed should be a string');
            subtest.equal(typeof result.process.external, 'string', 'process.external should be a string');
            subtest.equal(typeof result.os.free, 'string', 'os.free should be a string');
            subtest.equal(typeof result.os.total, 'string', 'os.total should be a string');
            subtest.end();
            end();
        });
    });
});
