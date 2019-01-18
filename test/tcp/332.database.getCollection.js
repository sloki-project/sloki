let dbName = "__testAddCollectionWithOptions";
let collectionName = "myCollection";


let expectedCollectionProperties = {
    "name":collectionName,
    "data":[],
    "idIndex":[],
    "binaryIndices":{},
    "constraints":{
        "unique":{
            "uid":{
                "field":"uid",
                "keyMap":{},
                "lokiMap":{}
            }
        },
        "exact":{}
    },
    "uniqueNames":["uid"],
    "transforms":{},
    "objType":collectionName,
    "dirty":false,   // collection has just been created, so it's considered as dirty
    "cachedIndex":null,
    "cachedBinaryIndex":null,
    "cachedData":null,
    "adaptiveBinaryIndices":true,
    "transactional":false,
    "cloneObjects":false,
    "cloneMethod":"parse-stringify",
    "asyncListeners":false,
    "disableMeta":false,
    "disableChangesApi":true,
    "disableDeltaChangesApi":true,
    "autoupdate":false,
    "serializableIndices":true,
    "ttl":{
        "age":null,
        "ttlInterval":null,
        "daemon":null
    },
    "maxId":0,
    "DynamicViews":[],
    "events":{
        "insert":[],
        "update":[],
        "pre-insert":[],
        "pre-update":[],
        "close":[],
        "flushbuffer":[],
        "error":[],
        "delete":[null],
        "warning":[null]
    },
    "changes":[]
}


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
            subtest.deepEqual(result, expectedCollectionProperties, "should return "+collectionName+" properties");
            subtest.end();
        });
    });

});
