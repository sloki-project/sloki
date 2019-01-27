let dbName = "__testInsert";
let collectionName = "testInsert_"+Date.now();
let collectionNameFake = "testInsert_"+(Date.now()+1000);

const ERROR_CODE_PARAMETER = -32602;

require('./client')(__filename, (test, client) => {
    test.test("use", (subtest)  => {
        client.use(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, dbName, `current database should be ${dbName}`);
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

    test.test("insert should create the collection if the collection does not exist", (subtest)  => {
        client.insert(collectionNameFake, {}, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, 1, `should return 1`);
            subtest.end();
        });
    });

    test.test("insert should return $loki (loki id)", (subtest)  => {
        client.insert(collectionName, {}, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, 1, `should return 1`);
            subtest.end();
        });
    });


});
