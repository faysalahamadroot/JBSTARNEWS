import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ users, selectedUser, selectUser, onlineUsers }) => {
    const { user, logout } = useAuth();

    return (
        <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="flex items-center">
                    <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <span className="font-semibold text-gray-800">{user?.name}</span>
                </div>
                <button
                    onClick={logout}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                    Logout
                </button>
            </div>
            <div className="overflow-y-auto flex-1 p-2">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-2">
                    Direct Messages
                </h2>
                {users.map((u) => (
                    <div
                        key={u._id}
                        onClick={() => selectUser(u)}
                        className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition-colors ${selectedUser?._id === u._id
                                ? 'bg-blue-50 text-blue-600'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        <div className="relative">
                            <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            {/* Online indicator placeholder - can be improved with real socket status */}
                            {onlineUsers && onlineUsers.includes(u._id) && (
                                <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                            )}
                        </div>
                        <div>
                            <p className="font-medium ">{u.name}</p>
                            <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
