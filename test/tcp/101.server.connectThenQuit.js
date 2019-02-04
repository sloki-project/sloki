require('./client')(__filename, (test, client) => {
    try {
        client.quit((err) => {
            test.deepEqual(err, undefined, 'command should not return an error');
            test.pass('should be disconnected by the server');
            test.end();
        });
    } catch(e) {
        test.fail(e.message);
        test.end();
    }
});
