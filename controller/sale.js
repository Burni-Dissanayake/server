const express = require('express')
const {createSale,deleteSale,getSalesList, payForSale} = require("../service/sale");
const router = express.Router()


async function create (req, res) {
    const response = await createSale(req);
    return res.status(response.status).json({response: response.response})
}
async function deleteS (req, res) {
    const response = await deleteSale(req);
    return res.status(response.status).json({response: response.response})
}
async function find (req, res) {
    const response = await getSalesList(req);
    return res.status(response.status).json({response: response.response})
}

async function pay (req, res) {
    const response = await payForSale(req);
    return res.status(response.status).json({response: response.response})
}

router.post('/', create)
router.delete('/:id', deleteS)
router.get('/', find)
router.put('/pay/:id', pay)

module.exports = router
