let dbName = "__testGet_410_"+Date.now();
let collectionName = "insertAndGet_"+Date.now();
let doc = {foo: "bar"};
let expected = {
    foo: 'bar',
    meta: {
        revision: 0,
        created: true, // can not test variable timestamp
        version: 0
    },
    $loki: 1
};

let expectedErr = {
    code: -32603,
    message: 'Object is not a document stored in the collection'
};

const ERROR_CODE_PARAMETER = -32602;

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        test.test("insert should return document", (subtest)  => {
            client.insert(collectionName, doc, (err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                result.meta.created = typeof result.meta.created === 'number';
                subtest.deepEqual(result, expected, `should return document`);
                subtest.end();
            });
        });

        test.test("get should return error when collection does not exist", (subtest)  => {
            client.get("unexistingCollection", 1, (err, result) => {
                let expectedErr = {
                    code: ERROR_CODE_PARAMETER,
                    message: `collection unexistingCollection does not exist in database ${dbName}`
                }
                subtest.deepEqual(err, expectedErr, `should return error ${JSON.stringify(expectedErr)}`);
                subtest.end();
            });
        });

        test.test("get should return document", (subtest)  => {
            client.get(collectionName, 1, (err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                result.meta.created = typeof result.meta.created === 'number';
                subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                subtest.end();
            });
        });

        test.test("get on a non existing document by id should return null", (subtest)  => {
            client.get(collectionName, 10, (err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                subtest.deepEqual(result, null, `should return error ${JSON.stringify(expectedErr)}`);
                subtest.end();
            });
        });
    });
});
