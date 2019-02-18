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

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database:dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.insert({ collection:collectionName, document: doc }, (err, result) => {

            test.deepEqual(err, undefined, 'insert should not return any error');
            test.deepEqual(typeof result, 'object', 'document inserted');

            test.test('find without filters should return array of documents', (subtest)  => {
                client.find({ collection:collectionName }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    result[0].meta.created = typeof result[0].meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test('find with filters should return array of documents', (subtest)  => {
                client.find({ collection:collectionName, filters:doc }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    result[0].meta.created = typeof result[0].meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test('find should return [] if no result', (subtest)  => {
                client.find({ collection:collectionName, filters:{ foo:'bar2' } }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    subtest.deepEqual(result, [], `should return ${JSON.stringify([])}`);
                    subtest.end();
                    end();
                });
            });

        });
    });
});
