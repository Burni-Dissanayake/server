const { MongoClient } = require('mongodb');
const url = 'mongodb+srv://Burns:BurMo123@cluster0.ly8cbgp.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);

const dbName = 'rubber_inventory';

exports.getDB = async ()  =>{
    await client.connect();
    return client.db(dbName);
}


