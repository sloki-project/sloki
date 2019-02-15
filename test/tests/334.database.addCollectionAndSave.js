const dbName = '__testAddCollectionWithOptions';
const collectionName = 'myCollectionForceSave_'+Date.now();
const collectionOptions = { unique:['uid'] };

const expectedCollectionProperties = {
    name :collectionName,
    data :[],
    idIndex :[],
    binaryIndices :{},
    constraints :{
        unique :{
            uid :{
                field :'uid',
                keyMap :{},
                lokiMap :{}
            }
        },
        exact :{}
    },
    uniqueNames :['uid'],
    transforms :{},
    objType :collectionName,
    dirty :true,   // will become false after saveDatabase() call
    cachedIndex :null,
    cachedBinaryIndex :null,
    cachedData :null,
    adaptiveBinaryIndices :true,
    transactional :false,
    cloneObjects :false,
    cloneMethod :'parse-stringify',
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
        'pre-insert' :[],
        'pre-update' :[],
        close :[],
        flushbuffer :[],
        error :[],
        delete :[null],
        warning :[null]
    },
    changes :[]
};

require('./client')(__filename, (test, client) => {
    client.loadDatabase({ database: dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        test.test('addCollection', (subtest)  => {
            client.addCollection({ collection:collectionName, options: collectionOptions }, (err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                subtest.deepEqual(result, expectedCollectionProperties, 'should return '+collectionName);
                expectedCollectionProperties.dirty = false;
                subtest.end();
            });
        });

        test.test('saveDatabase', (subtest) => {
            client.saveDatabase((err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                subtest.deepEqual(result, undefined, 'should return undefined');
                subtest.end();
            });
        });

        test.test('getCollection', (subtest)  => {
            client.getCollection({ collection:collectionName }, (err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                subtest.deepEqual(result, expectedCollectionProperties, 'should return '+collectionName+' properties');
                subtest.end();
            });
        });
    });
});
