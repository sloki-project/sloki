let dbName = "__testInsert_401"+Date.now();
let collectionName = "insertAndGet_"+Date.now();
let doc = {"foo":"bar"};

const ERROR_CODE_PARAMETER = -32602;

require('./client')(__filename, (test, client) => {
    test.test("use", (subtest)  => {
        client.loadDatabase(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.ok(typeof result, "object", "should return database properties");
            subtest.end();
        });
    });

    test.test("insert should return $loki (loki id)", (subtest)  => {
        client.insert(collectionName, doc, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, 1, `should return 1`);
            subtest.end();
        });
    });

    test.test("get should return error when collection does not exist", (subtest)  => {
        client.get("unexistingCollection", 1, (err, result) => {
            let expectedErr = { code: ERROR_CODE_PARAMETER, message: "collection unexistingCollection does not exist" }
            subtest.deepEqual(err, expectedErr, 'command should not return an error');
            subtest.end();
        });
    });

    test.test("get should return document", (subtest)  => {
        client.get(collectionName, 1, (err, result) => {
            let expectedDoc = { foo: 'bar', meta: { revision: 0, created: 1548660734652, version: 0 }, $loki: 1 };
            subtest.deepEqual(err, undefined, 'command should not return an error');
            delete expectedDoc.meta.created;
            delete result.meta.created;
            subtest.deepEqual(result, expectedDoc, `should return ${JSON.stringify(expectedDoc)}`);
            subtest.end();
        });
    });


});
