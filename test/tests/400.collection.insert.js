const ERROR_CODE_PARAMETER = -32602;

const dbName = '__testInsert400_'+Date.now();
const collectionName = 'insert';
const collectionNameNotExists = 'insertNotExist';
const doc = { 'foo':'bar' };

const expected = {
    foo: 'bar',
    meta: {
        revision: 0,
        created: true, // can not test variable timestamp
        version: 0
    },
    $loki: 1
};

const expectedErr = {
    code: ERROR_CODE_PARAMETER,
    message: 'method "insert": property collection (alias col,c) is mandatory'
};

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database: dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.addCollection({ collection:collectionName }, (err, result) => {

            test.deepEqual(err, undefined, 'addCollection should not return any error');
            test.deepEqual(typeof result, 'object', 'collection created');

            test.test('insert should fail if collection name is null', (subtest)  => {
                client.insert(null, (err, result) => {
                    subtest.deepEqual(err, expectedErr, `should return error ${expectedErr.message}`);
                    subtest.deepEqual(result, undefined, 'result should be undefined');
                    subtest.end();
                });
            });

            test.test('insert should fail if collection name is undefined', (subtest)  => {
                client.insert(undefined, (err, result) => {
                    subtest.deepEqual(err, expectedErr, `should return error ${expectedErr.message}`);
                    subtest.deepEqual(result, undefined, 'result should be undefined');
                    subtest.end();
                });
            });

            test.test('insert should create the collection if it does not exist, then insert', (subtest)  => {
                client.insert({ collection:collectionNameNotExists, document:doc }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    result.meta.created = typeof result.meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test('insert should return document', (subtest)  => {
                client.insert({ collection:collectionName, document:doc }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    result.meta.created = typeof result.meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test('insert without callback (lazy mode)', (subtest)  => {
                client.insert({ collection:collectionName, document: doc }, { lazy:true });
                subtest.pass('pass');
                subtest.end();
                end();
            });
        });
    });
});
