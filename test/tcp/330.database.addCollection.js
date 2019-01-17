let dbName = "__testAddCollection";
let collectionName = "myCollection";

require('./client')(__filename, (test, client) => {
    test.test("use", (subtest)  => {
        client.use(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
            subtest.end();
        });
    });

    test.test("addCollection, missing collectionName", (subtest)  => {
        client.addCollection(null, (err, result) => {
            subtest.deepEqual(err, { code: -32602, message: 'collectionName is mandatory' });
            subtest.end();
        });
    })

    test.test("addCollection", (subtest)  => {
        client.addCollection(collectionName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, collectionName, "should return "+collectionName);
            subtest.end();
        });
    })

    test.test("listCollections", (subtest)  => {
        let expected = [{ name: 'myCollection', type: 'myCollection', count: 0 }];
        client.listCollections((err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, expected, "should return "+JSON.stringify(expected));
            subtest.end();
        });
    })
});
