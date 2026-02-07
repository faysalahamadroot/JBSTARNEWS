const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const { protect } = require('./middleware/auth');
const Message = require('./models/Message');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
        // Add to online users if not already there (simple implementation)
        // Ideally we use a Set or Map
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('User joined room: ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', async (newMessageReceived) => {
        const { sender, receiver, content } = newMessageReceived;

        if (!receiver) return console.log('receiver not defined');

        // Save message to DB asynchronously
        try {
            // We can trust the client sent data (if validated) or just create from raw data
            // Ideally we should post via API and then emit, BUT for speed/realtime we can emit directly
            // However, best practice: Client posts to API -> API saves -> API emits via socket (or client emits after success)
            // The implementation plan says "Messages must be stored in database".
            // The API route `server/routes/messages.js` was just for GET.
            // Let's add a POST route for messages implicitly or just handle it here.
            // Let's Handle it here for simplicity of "real-time", OR better yet:
            // Let's ADD a POST route to `routes/messages.js` and use that.
            // Then in that route, we emit the socket event.
            // Users usually want immediate feedback.
            // We'll stick to: Client calls API to send message. API saves it and sends socket signal.
        } catch (error) {
            console.log(error);
        }

        socket.in(receiver._id).emit('message received', newMessageReceived);
    });

    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    });
});

// Add Message POST route logic requires accessing IO.
// To avoid circular dependency or complex passing, we can attach io to app specific request
// OR just let the client emit 'new message' and we handle saving here?
// "Messages must be: Stored in database".
// If I save in socket event, I need to make sure I have authentication.
// Socket authentication is tricky without middleware.
// BETTER APPROACH:
// 1. Client POSTs message to /api/messages.
// 2. /api/messages handler saves to DB.
// 3. /api/messages handler returns the message.
// 4. Client emits 'new message' with the returned message data to the receiver via Socket.
// This is secure because the POST endpoint is protected by JWT.

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
