const ERROR_CODE_PARAMETER = -32602;

let dbName = "__testInsert401_"+Date.now();
let collectionName = "insert";
let doc = {"foo":"bar"};

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        client.addCollection(collectionName, (err, result) => {

            test.test("insert should return undefined", (subtest)  => {
                client.insert(collectionName, doc, {sret:null}, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    subtest.deepEqual(result, undefined, `should return undefined`);
                    subtest.end();
                });
            });

            test.test("insert should return 1", (subtest)  => {
                client.insert(collectionName, doc, {sret:'01'}, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    subtest.deepEqual(result, 1, `should return 1`);
                    subtest.end();
                });
            });

            test.test("insert should return true", (subtest)  => {
                client.insert(collectionName, doc, {sret:'bool'}, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    subtest.deepEqual(result, true, `should return true`);
                    subtest.end();
                });
            });

            test.test("insert should return id", (subtest)  => {
                client.insert(collectionName, doc, {sret:'id'}, (err, result) => {
                    subtest.deepEqual(err, undefined, 'command should not return an error');
                    subtest.deepEqual(typeof result, 'number', `should return true`);
                    subtest.end();
                });
            });

        });
    });
});
