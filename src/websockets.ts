import { io } from "./http";
import { SocketAuth } from "./socketControllers/SocketAuth";
import { SocketDocument } from "./socketControllers/SocketDocument";
import { SocketUsers } from "./socketControllers/SocketUsers";
// import { prismaClient } from "../src/database/prismaClient";

import { SocketWorkspaces } from "./socketControllers/SocketWorkspace";



interface roomUsers {
    socket_id: string;
    user_id: string;
    room: string;
}

const users: roomUsers[] = [];
const socketWorkspaces = new SocketWorkspaces();
const socketAuth = new SocketAuth();
const socketUsers = new SocketUsers();
const socketDocument = new SocketDocument();


let user_id = "";

// io.use((socket, next) => {
//     // console.log(socket.handshake.auth.token,"socket token")
//     if (socket.handshake.auth.token) {
//         const authToken = socket.handshake.auth.token;
//         const [, Token] = authToken.split(" ");

//         const { sub } = verify(Token, "FlashPoint") as IPayload;
//         user_id = sub;
//         console.log(sub);

//         next();
//     }

//     const erro = new Error("Your sign probabli expirate!! sign in again to solve this problem");
//     next(erro);


// } 


//   );


io.on("connection", (socket) => {
    // console.log(socket.id, "User");

    socket.on("get_rooms", async (data, callback) => {
        const id = socketAuth.authentication(data.token);

        socket.join(id);
        try {
            const rooms = await socketWorkspaces.handleListWorkspace(id);
            // console.log(rooms);
            callback(rooms);
            // io.to(id).emit("rooms",rooms);

        } catch (error) {
            console.log(error)
        }



    });
    socket.on("newRoom", async (data, callback) => {
        const { title, token } = data;
        const id = socketAuth.authentication(token);
        const newRoom = await socketWorkspaces.handleCreateRoom(id, title);
        console.log(newRoom);
        callback(newRoom);
        io.to(id).emit("rooms", newRoom);
    });

    socket.on("addNewMember", async (data, callback) => {

        const id = socketAuth.authentication(data.token);

        if (await socketUsers.verifyEmail(data.memberEmail)) {
            const json = await socketWorkspaces.handleAddNewMember(id, data);

            const newRoom = {
                id: data.workspaceId,
                title: json.workspaceTitle
            }
            socket.join(json.memberId);
            io.to(json.memberId).emit("rooms", newRoom);
            socket.join(id);
            console.log("json", json, "newRoom", newRoom);
        }

        else {
            callback("E-mail não existe");
        }

    });

    socket.on("getMembers", async (data, callback) => {
        const emails = await socketUsers.getMembers(data);
        console.log(emails[0]);
        callback(emails);
    });


    socket.on("select_room", async (data, callback) => {
        console.log(data, "select_room")
        const header = await socketDocument.getHeaderData(data);
        // console.log(header);


       const components = await socketDocument.handleGetLoadOrder(data);
    //    console.log("components",components);

      const preLoad = {
        ...header,
        ...components
      }
      console.log(preLoad);

        //pegar o loadOrder  
        callback(preLoad)
        socket.join(data);
    });

    socket.on("docTitleUpdate",async(data)=>{
        let title = data.title;
        //update Title workspace
        await socketDocument.handleUpdateTitle(data.currentRoom, title)
        //emit to others rooms a new title
        io.to(data.currentRoom).emit("update", {"DocTitle":title});
        console.log("updateDocTitle: ",title);
    })

    socket.on("newComponent", async(data)=>{
        // console.log("newComponent",data)
        let {currentRoom, component} = data;
       await socketDocument.handleCreateNewComponent(currentRoom,component);
    
      //
      
     
    })

});

console.log(users);