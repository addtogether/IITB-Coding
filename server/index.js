require('dotenv').config()

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const http = require('http');
const { Server } = require('socket.io');

const connectDb = require('./db');
const app = express();

// HTTP Server
const server = http.createServer(app);

// Signalling Server (Web Socket Server)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['POST', 'GET']
    }
});
global.socket = io;

// Web Socket Connection
io.on('connection', (socket) => {
    console.log('User Connected');
    socket.on('disconnect', () => console.log('User Disconnected'));
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(cors());
app.use(fileUpload());

// routes
app.use('/api', require('./routes/routes'));

const PORT = process.env.PORT || 5000;

connectDb();
server.listen(PORT, async () => {
    try {
        console.log(`Server Running on Port ${PORT}`);
    } catch (error) {
        console.log('Error: ', error);
    }
});