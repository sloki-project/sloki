const dbName = '__testUpdate_440_'+Date.now();
const collectionName = 'myCollection_'+Date.now();

const doc = { foo:'bar' };

const expected1 = {
    foo: 'bar2',
    meta: {
        revision: 1,
        created: true,  // we can not test timestamp
        version: 0,
        updated: true,  // we can not test timestamp
    },
    $loki: 1
};

const expected2 = {
    foo: 'bar3',
    meta: {
        revision: 2,
        created: true,  // we can not test timestamp
        version: 0,
        updated: true,  // we can not test timestamp
    },
    $loki: 1
};

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database:dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.insert({ collection:collectionName, document:doc }, (err, myDoc) => {

            test.deepEqual(err, undefined, 'insert should not return any error');
            test.deepEqual(typeof myDoc, 'object', 'document inserted');

            test.test('update should return new document', subtest  => {

                myDoc.foo = 'bar2';

                client.update({ collection:collectionName, document:myDoc }, (err, newDoc) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    newDoc.meta.created = typeof newDoc.meta.created === 'number';
                    newDoc.meta.updated = typeof newDoc.meta.updated === 'number';
                    subtest.deepEqual(newDoc, expected1, `should return ${JSON.stringify(expected1)}`);
                    subtest.end();
                    end();
                });
            });

            test.test('update should return new document (meta not specified)', subtest  => {

                myDoc.foo = 'bar3';
                delete myDoc.meta;

                client.update({ collection:collectionName, document:myDoc }, (err, newDoc) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    newDoc.meta.created = typeof newDoc.meta.created === 'number';
                    newDoc.meta.updated = typeof newDoc.meta.updated === 'number';
                    subtest.deepEqual(newDoc, expected2, `should return ${JSON.stringify(expected2)}`);
                    subtest.end();
                    end();
                });
            });

        });
    });
});
