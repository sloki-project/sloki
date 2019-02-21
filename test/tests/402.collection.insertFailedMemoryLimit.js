const ERROR_CODE_INTERNAL = -32603;
const dbName = '__testInsert402_'+Date.now();
const collectionName = 'insert';
const prettyBytes = require('pretty-bytes');

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

            test.test('insert should hit memory limit to prevent nodejs crash - out of memory', async subtest  => {
                const max = 50000000;
                let reached = 0;
                let len = 0;
                const doc = { 'foo':'bar' };

                for (let i = 0;i<max;i++) {
                    doc.foo = doc.foo+i;
                    len+=JSON.stringify(doc).length;
                    try {
                        const inserted = await client.insert({ collection:collectionName, document:doc });
                        if (!inserted.foo) {
                            console.log(inserted);
                        }
                    } catch(err) {
                        if (!reached) {
                            reached = i;
                            subtest.deepEqual(err, expectedErr, `should return ${JSON.stringify(expectedErr)}`);
                            subtest.pass(`${reached} documents has been inserted (avg ${prettyBytes(len)})`);
                        }
                        i = max;
                    }
                }

                for (let i = 0;i<reached;i++) {
                    try {
                        await client.remove({ collection:collectionName, id:i+1 });
                    } catch(e) {
                        console.log(i, e.message);
                    }
                }

                subtest.pass(`removed ${reached} documents ...`);

                let gcResponse;
                try {
                    gcResponse = await client.gc();
                } catch(e) {
                    console.log(e);
                }

                subtest.deepEqual(gcResponse.called, true, 'gc (garbage collector) should return called = true');
                subtest.deepEqual(typeof gcResponse, 'object', `gc should return an object ${JSON.stringify(gcResponse, null, 4)}`);

                end();
                subtest.end();
            });
        });
    });
});
