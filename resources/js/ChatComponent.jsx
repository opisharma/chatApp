import React, { useState, useEffect } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

const ChatComponent = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Configure Echo with Pusher
        window.Pusher = Pusher;
        window.Echo = new Echo({
            broadcaster: 'pusher',
            key: process.env.MIX_PUSHER_APP_KEY,
            cluster: process.env.MIX_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        // Listen for new messages
        window.Echo.channel('chat').listen('MessageSent', (e) => {
            setMessages((prevMessages) => [...prevMessages, e.message]);
        });

        // Cleanup Echo on unmount
        return () => {
            window.Echo.leaveChannel('chat');
        };
    }, []);

    // Send message to the server
    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        await axios.post('/messages', { message });
        setMessage(''); // Clear input field
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.user.name}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatComponent;
