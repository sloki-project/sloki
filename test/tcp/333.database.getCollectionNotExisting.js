let dbName = "__testAddCollectionWithOptions";
let collectionName = "myCollectionNotExisting";


require('./client')(__filename, (test, client) => {
    test.test("use", (subtest)  => {
        client.use(dbName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, dbName, "current database should be '"+dbName+"'");
            subtest.end();
        });
    });

    test.test("getCollection", (subtest)  => {
        client.getCollection(collectionName, (err, result) => {
            subtest.deepEqual(err, undefined, 'command should not return an error');
            subtest.deepEqual(result, null, "should return "+collectionName+" properties");
            subtest.end();
        });
    });

});
