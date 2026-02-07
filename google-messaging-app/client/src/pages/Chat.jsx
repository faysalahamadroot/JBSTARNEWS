import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext'; // Import useSocket
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const Chat = () => {
    const { user } = useAuth();
    const socket = useSocket(); // Use socket
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // State for online users

    const fetchUsers = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/users', config);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user]);

    // specific effect for online users
    useEffect(() => {
        if (!socket) return;

        // We'd need the server to emit 'online users'
        // For now, let's assume we implement it or leave as proper stub
    }, [socket]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar
                users={users}
                selectedUser={selectedUser}
                selectUser={setSelectedUser}
                onlineUsers={[]} // Pass empty or real list
            />
            <ChatWindow selectedUser={selectedUser} />
        </div>
    );
};

export default Chat;
