"use strict"
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const httpContext = require("express-http-context");
const fileUpload = require("express-fileupload");
// require("dotenv").config({path: path.join(__dirname,"environment",".env.development")});

const chatController = require("./controllers/chat_controller");

const app = express();
app.use(bodyParser.json());
app.use(fileUpload());
app.use(httpContext.middleware);
const publicFolderPath = path.join(__dirname, "assests");
app.use(express.static(publicFolderPath));



// console.log("process")
// require("dotenv").config();

//Enable CORS for HTTP methods
app.use((req, resp, next) => {
    resp.header("Access-Control-Allow-Origin", "*",);
    resp.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization,Content-Type,Accept");
    next();
});


app.post("/api/user/registeration", chatController.insertRegisteration);
app.post("/api/user/login", chatController.userLogin);
app.get("/api/user/profile", chatController.verifyUserToken, chatController.fetchUserProfile);
app.get("/api/user/search", chatController.verifyUserToken, chatController.particularUserSearch);
app.post("/api/user/selected-chat", chatController.verifyUserToken, chatController.selectedChat);
app.get("/api/user/all-selected-chat-message", chatController.verifyUserToken, chatController.allSelectedChatMessage);
app.post("/api/user/send-message", chatController.verifyUserToken, chatController.sendMessage);
app.get("/api/user/all-chat", chatController.verifyUserToken, chatController.allUserChat);


//here this is used when we want to confirm backend server is running or not via browser.
app.get("/", (req, resp) => {
    resp.status(200).send("Welcome to Corewave Chat Backend APIs");
});




const port = process.env.PORT || 2000;
var server = app.listen(port, () => {
    console.log(`Server Started : Listen on : ${port}`)
})




const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        // origin: "http://localhost:3001",
        origin: "*",
        // credentials: true,
    },
});


io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userId) => {
        console.log("user_Data", userId);
        socket.join(userId);
        socket.emit("connected",userId);
    });

    socket.on("join chat", (roomId) => {
        console.log("roomId",roomId);
        socket.join(roomId);
        console.log("User Joined Room: " + roomId);
    });
    socket.on("typing", (roomId) => socket.in(roomId).emit("typing"));
    socket.on("stop typing", (roomId) => socket.in(roomId).emit("stop typing"));

    // socket.on("new message", (newMessageRecieved) => {
    //     var chat = newMessageRecieved.chat;

    //     if (!chat.users) return console.log("chat.users not defined");

    //     chat.users.forEach((user) => {
    //         if (user._id == newMessageRecieved.sender._id) return;

    //         socket.in(user._id).emit("message recieved", newMessageRecieved);
    //     });
    // });

    socket.on("new message", (newMessageRecieved) => {
        console.log("new Message recieved",newMessageRecieved);
        // const message = newMessageRecieved.message;
        const allUsersId = newMessageRecieved.users_id;
        const senderId = newMessageRecieved.sender_id;
        allUsersId.forEach((userId) => {
            if (senderId == userId) return;
            socket.in(userId).emit("message received", newMessageRecieved);
            console.log("hii");
        });
    });

    socket.on("disconnect", (userId) => {
        console.log("USER DISCONNECTED");
        socket.leave(userId);
    });
});

// // var myUser = "1234";

// io.on("connection",(socket)=>{
//     console.log("Socket Connection");
//     //user connection with socket
//     socket.on("setup",(userId)=>{
//         console.log("userId=",userId);
//         socket.join(userId);
//         socket.emit("connected");
//     })

//     socket.on("join chat",(room)=>{
//         console.log("room=",room);
//         socket.join(room)
//     })

//     socket.on("new message",(newMessageRecieved)=>{
//         console.log("newMessage recieved",newMessageRecieved);
//         const allUsers = newMessageRecieved.users;
//         const message = newMessageRecieved.message;
//         const myUser = newMessageRecieved.users[0];
//         allUsers.forEach((user)=>{
//             if(myUser===user) return;
//             socket.in(user).emit("message recieved",message);
//         })
//     })
// })
