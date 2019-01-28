let dbName = "__testInsert400_"+Date.now();
let collectionName = "insert";
let collectionNameNotExists = "insertNotExist";

const ERROR_CODE_PARAMETER = -32602;

require('./client')(__filename, (test, client) => {
    test.test("loadDatabase", (subtest)  => {
        client.loadDatabase(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.ok(typeof result, "object", "should return database properties");
            subtest.end();
        });
    });

    test.test(`addCollection should create collection '${collectionName}'`, (subtest)  => {
        client.addCollection(collectionName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, collectionName, `should return ${collectionName}`);
            subtest.end();
        });
    });

    test.test("insert should fail if collection name is null", (subtest)  => {
        client.insert(null, null, (err, result) => {
            let expected = { code: ERROR_CODE_PARAMETER, message: 'insert: number of parameters should be at least 2' };
            subtest.deepEqual(err, expected, `should return error ${expected.message}`);
            subtest.end();
        });
    });

    test.test("insert should fail if collection name is undefined", (subtest)  => {
        client.insert(undefined, null, (err, result) => {
            let expected = { code: ERROR_CODE_PARAMETER, message: 'insert: number of parameters should be at least 2' };
            subtest.deepEqual(err, expected, `should return error ${expected.message}`);
            subtest.end();
        });
    });

    test.test("insert should create the collection if it does not exist, then insert", (subtest)  => {
        client.insert(collectionNameNotExists, {"foo":"bar"}, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, 1, `should return 1`);
            subtest.end();
        });
    });

    test.test("insert should return $loki (loki id) 1", (subtest)  => {
        client.insert(collectionName, {"foo":"bar"}, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, 1, `should return 1`);
            subtest.end();
        });
    });

    test.test("insert without callback", (subtest)  => {
        client.insert(collectionName, {"foo":"bar"});
        subtest.end();
    });

});
