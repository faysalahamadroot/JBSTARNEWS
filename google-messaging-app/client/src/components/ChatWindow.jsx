import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

const ChatWindow = ({ selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);
    const { user } = useAuth();
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get(
                    `http://localhost:5000/api/messages/${selectedUser._id}`,
                    config
                );
                setMessages(data);
                scrollToBottom();
                socket.emit('join chat', selectedUser._id);
            } catch (error) {
                console.error("Failed to load messages", error);
            }
        };

        fetchMessages();
        // Reset messages when switching users
    }, [selectedUser, user.token]);

    useEffect(() => {
        if (!socket) return;

        const messageHandler = (newMessageReceived) => {
            if (
                !selectedUser ||
                selectedUser._id !== newMessageReceived.sender // Only append if it's from the currently selected user
            ) {
                // Notification logic could go here
            } else {
                setMessages((prev) => [...prev, newMessageReceived]);
                scrollToBottom();
            }
        };

        const typingHandler = () => setIsTyping(true);
        const stopTypingHandler = () => setIsTyping(false);

        socket.on('message received', messageHandler);
        socket.on('typing', typingHandler);
        socket.on('stop typing', stopTypingHandler);

        return () => {
            socket.off('message received', messageHandler);
            socket.off('typing', typingHandler);
            socket.off('stop typing', stopTypingHandler);
        };
    }, [socket, selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socket.emit('stop typing', selectedUser._id);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            };

            setNewMessage('');

            const { data } = await axios.post(
                'http://localhost:5000/api/messages',
                {
                    content: newMessage,
                    receiverId: selectedUser._id,
                },
                config
            );

            // Emit to socket
            socket.emit('new message', data);

            setMessages([...messages, data]);
        } catch (error) {
            console.error(error);
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socket) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedUser._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedUser._id);
                setTyping(false);
            }
        }, timerLength);
    };


    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 flex-col">
                <h2 className="text-2xl font-bold text-gray-400 mb-2">Welcome to GoogleChat</h2>
                <p className="text-gray-500">Select a user to start messaging</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center bg-gray-50 shadow-sm z-10">
                <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <span className="font-bold text-gray-800 block">{selectedUser.name}</span>
                    {isTyping ? <span className="text-xs text-green-500 font-medium">typing...</span> : <span className="text-xs text-gray-500">Online</span>}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 flex flex-col gap-3">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${m.sender === user._id || m.sender._id === user._id
                                ? 'bg-blue-600 text-white self-end rounded-br-none'
                                : 'bg-white text-gray-800 self-start rounded-bl-none'
                            }`}
                    >
                        <p>{m.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${m.sender === user._id || m.sender._id === user._id ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                    value={newMessage}
                    onChange={typingHandler}
                />
                <button
                    type="submit"
                    className="ml-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
