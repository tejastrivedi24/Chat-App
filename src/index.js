const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const publicDirectoryPath = path.join(__dirname,'../public')
const {generateMessage,generateLocationMessage} = require('./utils/messages.js')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
app.use(express.static(publicDirectoryPath))
app.use(require('cors')())
const server = http.createServer(app)
const io = socketio(server)
// let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection!!')

    
    
    socket.on('join', (options,callback) => {

        const {error,user} = addUser({id:socket.id,...options})

        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message',generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined !`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })
    socket.on('sendMessage',(message,callback)=>{

        const user = getUser(socket.id)
        const filter = new Filter() 
        if(filter.isProfane(message)){
            io.to(user.id).emit('message',generateMessage('Admin',`Profanity is not allowed ${user.username}`))
            callback()
            return
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user) 
        {
            io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left !`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    
    })
    socket.on('disconnection',(message)=>{

        console.log(message)
        socket.on('disconnect',()=>{
            const user = removeUser(socket.id)
            if(user) 
            {
                io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left !`))
                io.to(user.room).emit('roomData',{
                    room:user.room,
                    users:getUsersInRoom(user.room)
                })
            }
        
        })
    })

    socket.on('sendLocation', (coords,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude}, ${coords.longitude}`))
        callback()
    })
    // socket.emit('countUpdated',count)

    // socket.on('increment', () => {
    //     count++
    //     io.emit('countUpdated',count)
    // })

})
server.listen(port,()=>{
    console.log(`Server is running on port ${port}!`)
})