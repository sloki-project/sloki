const Client = require('../');

const client = new Client('tcp://127.0.0.1:6370');

client.init = async () => {
    try {
        await client.connect();
        await client.loadDatabase({ db:'myTestDatabase' });
        await client.insert({ col:'devices', doc:{ 'foo':'bar' } });
        const devices = await client.find({ col:'devices' });
        await client.saveDatabase();
        await client.close();

        console.log(devices);

    } catch(e) {
        console.log(e);
        client.close();
    }
};


client.init();
