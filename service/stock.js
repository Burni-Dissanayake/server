const {getDB} = require("../db/mongodb");
const { ObjectId } = require('mongodb');
const httpStatus = require("http-status");

exports.createStock = async ({body}) => {
    const collection = (await getDB()).collection("stocks")
    body.status = 'in stock'
    const response =  await collection.insertOne(body)
    return {
        status: httpStatus.OK,
        response: response
    }
}
exports.getStocks = async () => {
    const collection = (await getDB()).collection("stocks")
    const response = await (collection.find({}).toArray())
    return {
        status: httpStatus.OK,
        response: response
    }
}

exports.getStockById = async ({params}) => {
    const { id } = params
    const collection = (await getDB()).collection("stocks")
    const response = await (collection.findOne({_id: ObjectId(id)}))
    if(!response) {
        return {
            status: httpStatus.NOT_FOUND,
            response: "not found"
        }
    }
    return {
        status: httpStatus.OK,
        response: response
    }
}

exports.updateStock = async ({params,body}) => {
    const collection = (await getDB()).collection("stocks")
    const { id } = params
    const response = await (collection.updateOne({_id:ObjectId(id)},{$set:body}))
    if(!response) {
        return {
            status: httpStatus.NOT_FOUND,
            response: "not found"
        }
    }
    return {
        status: httpStatus.OK,
        response: response
    }
}
exports.deleteStock = async ({params}) => {

    const collection = (await getDB()).collection("stocks")
    const { id } = params
    const response = await (collection.updateOne({_id:ObjectId(id)},{$set:{status:'archived'}}))
    if(!response) {
        return {
            status: httpStatus.NOT_FOUND,
            response: "not found"
        }
    }
    return {
        status: httpStatus.OK,
        response: response
    }
}

exports.checkStockAvailability = async (req, res) => {
    const io = req.app.get('socketio');
    const { stock, qty } =req.query
    const collection = (await getDB()).collection("stocks")
    const response = await (collection.findOne({_id: ObjectId(stock)}))
    if(!response) {
        return {
            status: httpStatus.NOT_FOUND,
            response: "not found"
        }
    }
    console.log(response.qty)
    console.log(qty)
    io.emit('stock-availability', {availability: response.qty >=qty})
    return {
        status: httpStatus.OK,
        response: null
    }

}
