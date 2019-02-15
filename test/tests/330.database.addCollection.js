const dbName = '__testAddCollection';
const collectionName = 'myCollection_'+Date.now();

const ERROR_CODE_PARAMETER = -32602;

const expected = {
    name: collectionName,
    data: [],
    idIndex: [],
    binaryIndices: {},
    constraints: {
        unique: {},
        exact: {}
    },
    uniqueNames: [],
    transforms: {},
    objType: collectionName,
    dirty: true,
    cachedIndex: null,
    cachedBinaryIndex: null,
    cachedData: null,
    adaptiveBinaryIndices: true,
    transactional: false,
    cloneObjects: false,
    cloneMethod: 'parse-stringify',
    asyncListeners: false,
    disableMeta: false,
    disableChangesApi: true,
    disableDeltaChangesApi: true,
    autoupdate: false,
    serializableIndices: true,
    ttl: {
        age: null,
        ttlInterval:null,
        daemon: null
    },
    maxId: 0,
    DynamicViews: [],
    events: {
        insert: [],
        update: [],
        'pre-insert': [],
        'pre-update': [],
        close: [],
        flushbuffer: [],
        error: [],
        delete: [ null ],
        warning: [ null ]
    },
    changes: []
};

require('./client')(__filename, (test, client) => {
    client.loadDatabase({ database:dbName }, (err, result) => {
        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        test.test('addCollection should failed if Collection name is null', (subtest)  => {
            client.addCollection(null, (err, result) => {
                const expected = { code: ERROR_CODE_PARAMETER, message: 'method "addCollection": property collection (alias col,c) is mandatory' };
                subtest.deepEqual(err, expected, `should return error ${expected.message}`);
                subtest.deepEqual(result, undefined, 'result should be undefined');
                subtest.end();
            });
        });

        test.test('addCollection should failed if Collection name is undefined', (subtest)  => {
            client.addCollection(undefined, (err, result) => {
                const expected = { code: ERROR_CODE_PARAMETER, message: 'method "addCollection": property collection (alias col,c) is mandatory' };
                subtest.deepEqual(err, expected, `should return error ${expected.message}`);
                subtest.deepEqual(result, undefined, 'result should be undefined');
                subtest.end();
            });
        });

        test.test(`addCollection should create collection '${collectionName}'`, (subtest)  => {
            client.addCollection({ collection:collectionName }, (err, result) => {
                subtest.deepEqual(err, undefined, 'method should not return an error');
                subtest.deepEqual(result, expected, 'should return collection properties');
                subtest.end();
            });
        });

    });

});
