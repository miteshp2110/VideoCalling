
const express=require('express')
const app=express()
const http=require('http')
const path=require('path')
const cors=require("cors")
const socketIO=require('socket.io')
const server=http.createServer(app)


//Static files
app.use(cors())

app.use(express.static(path.join(__dirname,'/client')))
app.use('/room',express.static(path.join(__dirname,'/static')))

//socketio

const io=socketIO(server)

io.on('connection',(socket)=>{
    console.log("User joined ")

    socket.join(socket.handshake.query.room)

    socket.on('offer',(data)=>{
        socket.to(socket.handshake.query.room).emit('offer',data)
    })

    socket.on('answer',(data)=>{
        socket.to(socket.handshake.query.room).emit('answer',data)

    })

    socket.on('candidate',(data)=>{
        socket.to(socket.handshake.query.room).emit('candidate',data)
    })

    socket.on('disconnect',()=>{
        console.log("user disconnected")
    })

    

    



})






server.listen(3000,()=>{
    console.log("Server running")
})