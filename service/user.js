
const {getDB} = require('../db/mongodb')
const httpStatus = require("http-status");

exports.createUser = async ({body}) => {
    const db = await getDB();
    const collection = db.collection('users');
    body.role = 'user'
    const response =   await collection.insertOne(body);
    return {
        status: httpStatus.OK,
        response
    }
}

exports.loginUser = async ({body}) => {
    const db = await getDB();
    const { email, password } = body;
    const collection = db.collection('users');
    const user = await collection.findOne({email: email})

    if(!user || user.password !== password) {
        return {
            status: httpStatus.UNAUTHORIZED,
            response: 'unauthorized'
        }
    }

    return  {
        status: httpStatus.OK,
        response : {
            id: user._id,
            role: user.role
        }
    }


}

exports.getUsers = async () => {
    const collection = (await getDB()).collection("users")
    const response = await (collection.find({}).toArray())
    return {
        status: httpStatus.OK,
        response: response
    }
}
