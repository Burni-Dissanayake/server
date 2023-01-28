const express = require('express')
const router = express.Router()


const users = require('./user')
const stocks = require('./stock')
const sales = require('./sale')


router.use('/users', users)
router.use('/stocks', stocks)
router.use('/sales', sales)

module.exports = router
