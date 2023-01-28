const express = require('express')
const router = express.Router()

const { createUser, loginUser, getUsers} = require('../service/user')
async function registerUser (req, res) {
   const response =  await  createUser(req)
    return res.status(response.status).json({response: response.response})
}

async function login(req, res) {
    const response =  await  loginUser(req)
    return res.status(response.status).json({response: response.response})
}
async function findAll (req, res) {
    const response = await  getUsers();
    return res.status(response.status).json({response: response.response})

}


router.post('/', registerUser)
router.post('/login', login)
router.get('/', findAll)


module.exports = router
