const ERROR_CODE_INTERNAL = -32603;
const dbName = '__testInsert402_'+Date.now();
const collectionName = 'insert';
const doc = { 'foo':'bar' };

const expectedErr = {
    code: ERROR_CODE_INTERNAL,
    message: 'method "insert": memory limit reached'
};

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database: dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.addCollection({ collection:collectionName }, (err, result) => {

            test.deepEqual(err, undefined, 'addCollection should not return any error');
            test.deepEqual(typeof result, 'object', 'collection created');

            test.test('insert should hit memory limit (15Mb for test) to avoid nodejs crash', async subtest  => {
                const max = 50000000;
                for (let i = 0;i<max;i++) {
                    doc.foo = doc.foo+i;
                    try {
                        await client.insert({ collection:collectionName, document:doc });
                    } catch(err) {
                        subtest.deepEqual(err, expectedErr, `should return ${JSON.stringify(expectedErr)}`);
                        i = max;
                    }
                }
                subtest.end();
                end();
            });

        });
    });
});
