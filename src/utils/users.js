const users = []

const availableRooms = () => {
    if(users){
        var currRooms=[]
        users.forEach((user)=>{
            if(!currRooms){
                currRooms.push(user)
            }
            else{
                const temp = currRooms.find((inuser)=>{
                    return inuser.room===user.room
                })
                if(!temp){
                    currRooms.push(user)
                }
                
                    
                
            }
            
           
            
        })
    }
    return currRooms
}
const addUser= ({ id,username,room }) => {
    //clean the data
    // username = username.trim().toLowerCase()
    // room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error:'Username and room are required'
        }
    }

    //Check for existing user
    const existingUser=users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate username
    if(existingUser){
        return {
            error:'Username is in use'
        }
    }

    //Store user
    const user = { id,username,room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id===id)
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) =>user.room === room)
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    availableRooms
}

