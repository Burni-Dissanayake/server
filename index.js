const PORT = 8080
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: true }))
const controller = require('./controller')
app.use(express.json())
app.use('/api', controller)

const socket = require("socket.io")
const http = require("http")


const httpServer = http.createServer(app);
const io = new socket.Server(httpServer, { cors: { origin: '*' } });
app.set('socketio', io);

httpServer.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`)
})

module.exports = app;
