let dbName = "__testAddCollection";
let collectionName = "myCollection";

const ERROR_CODE_PARAMETER = -32602;

require('./client')(__filename, (test, client) => {
    test.test("use", (subtest)  => {
        client.use(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
            subtest.end();
        });
    });

    test.test("addCollection should failed if Collection name is null", (subtest)  => {
        client.addCollection(null, (err, result) => {
            let expected = { code: ERROR_CODE_PARAMETER, message: "addCollection: parameter 'Collection name' is mandatory" };
            subtest.deepEqual(err, expected, `should return error ${expected.message}`);
            subtest.end();
        });
    })

    test.test("addCollection should failed if Collection name is undefined", (subtest)  => {
        client.addCollection(undefined, (err, result) => {
            let expected = { code: ERROR_CODE_PARAMETER, message: "addCollection: parameter 'Collection name' is mandatory" };
            subtest.deepEqual(err, expected, `should return error ${expected.message}`);
            subtest.end();
        });
    })

    test.test(`addCollection should create collection '${collectionName}'`, (subtest)  => {
        client.addCollection(collectionName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, collectionName, `should return ${collectionName}`);
            subtest.end();
        });
    })

    test.test("listCollections", (subtest)  => {
        client.listCollections((err, result) => {
            let expected = [{ name: collectionName, type: collectionName, count: 0 }];
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, expected, `should return ${JSON.stringify(expected)}`);
            subtest.end();
        });
    })
});
