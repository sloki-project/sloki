const dbName = '__testUpdate_440_'+Date.now();
const collectionName = 'myCollection_'+Date.now();

const doc = { foo:'bar' };

const expected = {
    foo: 'bar2',
    meta: {
        revision: 1,
        created: true,  // we can not test timestamp
        version: 0,
        updated: true,  // we can not test timestamp
    },
    $loki: 1
};

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.insert(collectionName, doc, (err, myDoc) => {

            test.deepEqual(err, undefined, 'insert should not return any error');
            test.deepEqual(typeof myDoc, 'object', 'document inserted');

            test.test('update should return new document', (subtest)  => {

                myDoc.foo = 'bar2';

                client.update(collectionName, myDoc, (err, newDoc) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    newDoc.meta.created = typeof newDoc.meta.created === 'number';
                    newDoc.meta.updated = typeof newDoc.meta.updated === 'number';
                    subtest.deepEqual(newDoc, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

        });
    });
});
