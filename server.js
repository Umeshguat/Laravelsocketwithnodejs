// const express = require('express');
import express from "express";
import { Server } from 'socket.io';
const app = express();
const port =  4000;
// const wifiIp = "192.168.1.4"
var server = app.listen(port, () => {
    console.log(`Server is running ${port}`);
});

// const server = require('http').createServer(app);

// app.use((req, resp, next) => {
//     console.log("hiii");
//     resp.header("Access-Control-Allow-Origin", "*",);
//     resp.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     resp.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Authorization,Content-Type,Accept");
//     next();
// });

const io = new Server(server, {
    cors: { origin: "*"}
});

app.get("/",(req,resp)=> {
    resp.status(200).json("socket is running");
})


io.on('connection', (socket) => {
    console.log('connection');
    socket.on("connect user",(userId)=>{
        console.log("userId",userId);
        socket.join(userId);
        socket.emit("successfull joined socket",userId)
    })

    socket.on("chat room",(roomId)=>{
        console.log("my room Id",roomId);
        socket.join(roomId);
    })
    socket.emit("room connected","Connection Successfully");

    socket.on("new message",(messageObject)=>{
        console.log("neww Message",messageObject);
        const senderId = messageObject.allUsers[0];
        const recieverId = messageObject.allUsers[1];
        const allUserArr = messageObject.allUsers;
        allUserArr.forEach((userId)=>{
            if(senderId == userId){
                return;
            }
            console.log("hioio",userId);
            socket.to(555).emit("message recieved",messageObject);
            console.log("done");
        })
    })


    socket.on('disconnect', (socket) => {
        console.log('Disconnect');
    });
});

