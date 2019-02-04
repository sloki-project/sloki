const dbName = '__testFind_430_'+Date.now();
const collectionName = 'myCollection_'+Date.now();

const doc = { foo:'bar' };

const expected = [
    {
        foo: 'bar',
        meta: {
            revision: 0,
            created: true,
            version: 0
        },
        $loki: 1
    }
];

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        client.insert(collectionName, doc, (err, result) => {
            test.test('find should return array of doc', (subtest)  => {
                client.find(collectionName, doc, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    result[0].meta.created = typeof result[0].meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test('find should return [] if no result', (subtest)  => {
                client.find(collectionName, {foo:'bar2'}, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    subtest.deepEqual(result, [], `should return ${JSON.stringify([])}`);
                    subtest.end();
                });
            });

        });
    });
});
