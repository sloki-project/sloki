const dbName = '__testInsert401_'+Date.now();
const collectionName = 'insert';
const doc = { 'foo':'bar' };

require('./client')(__filename, (test, client, end) => {
    client.loadDatabase({ database:dbName }, (err, result) => {

        test.deepEqual(err, undefined, 'loadDatabase should not return any error');
        test.deepEqual(typeof result, 'object', 'database loaded');

        client.addCollection({ collection:collectionName }, (err, result) => {

            test.deepEqual(err, undefined, 'addCollection should not return any error');
            test.deepEqual(typeof result, 'object', 'collection created');

            test.test('insert should return undefined', subtest  => {
                client.insert({ collection:collectionName, document:doc, options:{ sret:null } }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    subtest.deepEqual(result, undefined, 'should return undefined');
                    subtest.end();
                });
            });

            test.test('insert should return 1', subtest  => {
                client.insert({ collection:collectionName, document:doc, options: { sret:'01' } }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    subtest.deepEqual(result, 1, 'should return 1');
                    subtest.end();
                });
            });

            test.test('insert should return true', subtest  => {
                client.insert({ collection:collectionName, document:doc, options:{ sret:'bool' } }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    subtest.deepEqual(result, true, 'should return true');
                    subtest.end();
                });
            });

            test.test('insert should return id', subtest  => {
                client.insert({ collection:collectionName, document:doc, options:{ sret:'id' } }, (err, result) => {
                    subtest.deepEqual(err, undefined, 'method should not return an error');
                    subtest.deepEqual(typeof result, 'number', 'should return true');
                    subtest.end();
                    end();
                });
            });

        });
    });
});
