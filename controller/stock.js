const express = require('express')
const router = express.Router()

const { createStock,getStocks,getStockById,updateStock,deleteStock,checkStockAvailability } = require('../service/stock')

async function create (req, res) {
    const response = await  createStock(req);
    return res.status(response.status).json({response: response.response})

}
async function getById (req, res) {
    const response = await  getStockById(req);
    return res.status(response.status).json({response: response.response})

}
async function findAll (req, res) {
    const response = await  getStocks();
    return res.status(response.status).json({response: response.response})

}
async function update (req, res) {
    const response = await  updateStock(req);
    return res.status(response.status).json({response: response.response})

}
async function deleteOne (req, res) {
    const response = await  deleteStock(req);
    return res.status(response.status).json({response: response.response})

}
async function stockAvailability (req, res) {
    const response = await  checkStockAvailability(req);
    return res.status(response.status).json({response: response.response})

}
router.post('/', create)
router.get('/', findAll)
router.get('/:id', getById)
router.put('/:id', update)
router.delete('/:id', deleteOne)
router.get('/stock/availability',stockAvailability)

module.exports = router
