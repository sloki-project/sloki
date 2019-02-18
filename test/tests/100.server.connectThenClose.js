require('./client')(__filename, (test, client, end) => {
    client.close();
    test.end();
    end();
});
