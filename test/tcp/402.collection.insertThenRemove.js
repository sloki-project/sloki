let dbName = "__testRemove_402"+Date.now();
let collectionName = "myCollection_"+Date.now();
let doc1 = {"foo":"bar"};
let doc2 = {"foo":"bar","door":"red"};
let docDoesNotExist1 = {"foo1":"bar"};
let docDoesNotExist2 = {"foo":"bar2"};

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
        client.insert(collectionName, doc1, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, doc1, `should return ${JSON.stringify(doc1)}`);
            subtest.end();
        });
    });

    test.test("insert should return $loki (loki id)", (subtest)  => {
        client.insert(collectionName, doc2, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, doc1, `should return ${JSON.stringify(doc2)}`);
            subtest.end();
        });
    });

    test.test("remove a document should return document", (subtest)  => {
        client.remove(collectionName, doc1, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, doc1, `should return ${JSON.stringify(expectedDoc)}`);
            subtest.end();
        });
    });

});
