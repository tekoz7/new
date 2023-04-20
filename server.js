import http from 'http'
import express from 'express'
import { resolve } from 'path'
import { Server } from 'socket.io'
import socketConfiguration from './main.js'

const port = 3000
const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static(resolve('client')))

app.get('/', (req, res) => {
    res.sendFile(resolve('client', 'index.html'))
})

socketConfiguration(sockets)

server.listen(port, () => console.log(`Server on: http://localhost:${port}`))