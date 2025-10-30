import React, { useState, useEffect } from 'react';

interface ChatbotProps {
  onClose?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Thank you for your message. Our support team will get back to you soon.' }]);
    }, 800);
    setInput('');
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('Chatbot: Escape pressed');
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col">
      <div className="bg-blue-600 text-white px-4 py-2 rounded-t-lg font-semibold flex items-center justify-between">
        <span>Help & Support Chatbot</span>
        <button
          className="ml-2 text-white hover:text-gray-200 text-lg font-bold"
          onClick={() => { console.log('Chatbot close clicked'); if (onClose) onClose(); }}
          aria-label="Close chatbot"
        >×</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-700'}`}>{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-200 items-center space-x-2 p-2">
        <input
          className="flex-1 px-3 py-2 outline-none text-sm"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-blue-700"
          onClick={handleSend}
        >Send</button>
        <button
          className="ml-2 text-sm text-gray-600 px-3 py-2 hover:bg-gray-100 rounded"
          onClick={() => { console.log('Chatbot: footer close clicked'); if (onClose) onClose(); }}
        >Close</button>
      </div>
    </div>
  );
};

export default Chatbot;
