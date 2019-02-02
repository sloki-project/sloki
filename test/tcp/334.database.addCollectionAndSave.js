const use = require('abrequire');
const ENV = use('src/env');

let dbName = "__testAddCollectionWithOptions";
let collectionName = "myCollectionForceSave_"+Date.now();
let collectionOptions = {unique:['uid']};

let expectedCollectionProperties = {
    name :collectionName,
    data :[],
    idIndex :[],
    binaryIndices :{},
    constraints :{
        unique :{
            uid :{
                field :"uid",
                keyMap :{},
                lokiMap :{}
            }
        },
        exact :{}
    },
    uniqueNames :["uid"],
    transforms :{},
    objType :collectionName,
    dirty :true,   // will become false after saveDatabase() call
    cachedIndex :null,
    cachedBinaryIndex :null,
    cachedData :null,
    adaptiveBinaryIndices :true,
    transactional :false,
    cloneObjects :false,
    cloneMethod :"parse-stringify",
    asyncListeners :false,
    disableMeta :false,
    disableChangesApi :true,
    disableDeltaChangesApi :true,
    autoupdate :false,
    serializableIndices :true,
    ttl :{
        age :null,
        ttlInterval :null,
        daemon :null
    },
    maxId :0,
    DynamicViews :[],
    events :{
        insert :[],
        update :[],
        "pre-insert" :[],
        "pre-update" :[],
        close :[],
        flushbuffer :[],
        error :[],
        delete :[null],
        warning :[null]
    },
    changes :[]
}

require('./client')(__filename, (test, client) => {
    client.loadDatabase(dbName, (err, result) => {
        test.test("addCollection", (subtest)  => {
            client.addCollection(collectionName, collectionOptions, (err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                subtest.deepEqual(result, expectedCollectionProperties, "should return "+collectionName);
                expectedCollectionProperties.dirty = false;
                subtest.end();
            });
        });

        test.test("saveDatabase", (subtest) => {
            client.saveDatabase((err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                subtest.deepEqual(result, dbName, "should return "+collectionName);
                subtest.end();
            })
        });

        test.test("getCollection", (subtest)  => {
            client.getCollection(collectionName, (err, result) => {
                subtest.deepEqual(err, undefined, 'command should not return an error');
                subtest.deepEqual(result, expectedCollectionProperties, "should return "+collectionName+" properties");
                subtest.end();
            });
        });
    });    
});
