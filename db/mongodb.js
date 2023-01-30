const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://Burns:BurMo123@cluster0.ly8cbgp.mongodb.net/?retryWrites=true&w=majority';


const dbName = 'rubber_inventory';
const { MongoMemoryServer } = require('mongodb-memory-server');
exports.getDB = async ()  =>{

    if(process.env.NODE_ENV === 'dev') {

        if(process.env.MONGOURI) {
            const client = new MongoClient(process.env.MONGOURI);
            await client.connect();
            return client.db(dbName);
        }else {
            const mongoTestServer = await MongoMemoryServer.create();
            process.env.MONGOURI =mongoTestServer.getUri()
            const client = new MongoClient(process.env.MONGOURI);
            await client.connect();
            return client.db(dbName);
        }
    }
    const client = new MongoClient(url);
    await client.connect();
    return client.db(dbName);
}


