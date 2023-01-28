const { ObjectId } = require('mongodb');
const {getDB} = require("../db/mongodb");
const {getStockById, updateStock} = require("./stock");
const httpStatus = require("http-status");

exports.createSale = async ({body}) => {


    const collection = (await getDB()).collection("sales");
    const stockResponse = await getStockById({params:{ id:body.stock}});
    if(stockResponse.status!==httpStatus.OK) {
        return stockResponse
    }
    const stock = stockResponse.response


    if(stock.qty < body.qty) {
        return {
            status: httpStatus.NOT_ACCEPTABLE,
            response: "Not Enough Quantity"
        }
    }

    const sale = {
        stock : ObjectId(body.stock),
        user: ObjectId(body.user),
        qty: body.qty,
        paymentStatus: 'not paid',
        amount : stock.unitPrice * body.qty,
        status: 'ACTIVE'
    }
    const response = await collection.insertOne(sale)
    const stockUpdate = {}
    if(stock.qty - body.qty ===0) {
        stockUpdate.status = 'out of stock'
        stockUpdate.qty =0
    }else {
        stockUpdate.qty = stock.qty - body.qty
    }

    await updateStock({params:{id: stock._id.toString()},body:{...stockUpdate}})

    return  {
        status: httpStatus.OK,
        response
    }


}

exports.deleteSale = async ({params}) => {
    const collection = (await getDB()).collection("sales")
    const { id } = params
    const sale = await (collection.findOne({_id:ObjectId(id)}))
    const response = await (collection.updateOne({_id:ObjectId(id)},{$set:{paymentStatus:'cancelled'}}))
    if(!sale) {
        return {
            status: httpStatus.NOT_FOUND,
            response: "not found"
        }
    }

    if(sale.paymentStatus === 'not paid') {
        const stock = (await getStockById({params:{id:sale.stock.toString()}})).response
        const stockUpdate = {
            qty : stock.qty + sale.qty
        };
        if(stock.status === 'out of stock') {
            stockUpdate.status = 'in stock'
        }

        await updateStock({params:{id: sale.stock.toString()},body:{...stockUpdate}})
    }

    return {
        status: httpStatus.OK,
        response: response
    }
}

exports.getSalesList = async ({query}) => {
    const collection = (await getDB()).collection("sales")
    const { user } = query
    const mongoQ = [];

    if(user) {
        mongoQ.push(
            {
                $match: {
                    user: ObjectId(user)
                }
            },
        )
    }
    mongoQ.push( {
            $lookup: {
                from: 'stocks',
                localField: 'stock',
                foreignField: '_id',
                as:'stock'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as:'user'
            }
        })

   const sales =  (await (collection.aggregate(mongoQ)).toArray()).map(value => {
       return {
           ...value,
           user: value.user[0],
           stock: value.stock[0]
       }
   })


    return {
        status: httpStatus.OK,
        response:sales
    }

}

exports.payForSale = async ({params}) => {
    const collection = (await getDB()).collection("sales")
    const { id } = params
    const sale = await (collection.findOne({_id:ObjectId(id)}))
    const response = await (collection.updateOne({_id:ObjectId(id)},{$set:{paymentStatus:'paid'}}))
    if(!sale) {
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
