import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');
            setIsBotTyping(true); // Show typing indicator
            const url = '';
            const data = {
                contents: [
                    {
                        parts: [{ text: input }],
                    },
                ],
            };
            try {
                const res = await axios.post(url, data);
                console.log(
                    'AI resposne: ',
                    res.data.candidates[0].content.parts[0].text,
                );
                setMessages((prev) => [
                    ...prev,
                    {
                        text: res.data.candidates[0].content.parts[0].text,
                        sender: 'bot',
                    },
                ]);
                setIsBotTyping(false);
            } catch {
                console.log('Error while getting response from api');
            }
            // Simulate bot response
            // setTimeout(() => {

            // }, 500);
        }
    };

    return (
        <div className="bg-slate-900 min-h-screen">
            <div className="fixed top-0 left-0 right-0 bg-slate-600 shadow-md z-10">
                <div className="text-center py-3 text-xl font-semibold text-white">
                    My ChatBot
                </div>
            </div>
            <div className="flex flex-col h-screen  w-8/12 mx-auto pt-16 pb-4">
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                msg.sender === 'user'
                                    ? 'justify-end'
                                    : 'justify-start'
                            } mb-2`}
                        >
                            <div
                                className={`rounded-lg p-3 max-w-[70%] ${
                                    msg.sender === 'user'
                                        ? 'bg-gray-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                {/* <pre>{msg.text}</pre> */}
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {/* Typing indicator */}
                    {isBotTyping && (
                        <div className="flex justify-start mb-2">
                            <div className="bg-gray-200 text-gray-800 rounded-lg p-3 max-w-[70%]">
                                Typing...
                            </div>
                        </div>
                    )}
                    {/* Empty div to track the end of messages */}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 rounded-md bg-slate-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === 'Enter' && handleSend()
                            }
                            className="flex-1 p-2 border rounded-lg focus:outline-none outline-none border-none  bg-slate-700 text-white"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={handleSend}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
