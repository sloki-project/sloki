require('./client')(__filename, (test, client) => {
    client.close();
    test.end();
});
