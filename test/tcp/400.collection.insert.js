const ERROR_CODE_PARAMETER = -32602;

let dbName = "__testInsert400_"+Date.now();
let collectionName = "insert";
let collectionNameNotExists = "insertNotExist";
let doc = {"foo":"bar"};

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
    code: ERROR_CODE_PARAMETER,
    message: "insert: parameter 'Collection name' is mandatory"
};

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        client.addCollection(collectionName, (err, result) => {
            test.test("insert should fail if collection name is null", (subtest)  => {
                client.insert(null, null, (err, result) => {
                    subtest.deepEqual(err, expectedErr, `should return error ${expectedErr.message}`);
                    subtest.end();
                });
            });

            test.test("insert should fail if collection name is undefined", (subtest)  => {
                client.insert(undefined, null, (err, result) => {
                    subtest.deepEqual(err, expectedErr, `should return error ${expectedErr.message}`);
                    subtest.end();
                });
            });

            test.test("insert should create the collection if it does not exist, then insert", (subtest)  => {
                client.insert(collectionNameNotExists, doc, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    result.meta.created = typeof result.meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test("insert should return document", (subtest)  => {
                client.insert(collectionName, doc, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    result.meta.created = typeof result.meta.created === 'number';
                    subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
                    subtest.end();
                });
            });

            test.test("insert without callback", (subtest)  => {
                client.insert(collectionName, doc);
                subtest.pass('pass');
                subtest.end();
            });
        });
    });
});
