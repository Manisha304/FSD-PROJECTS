import { useApp } from '../contexts/AppContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const { chatMessages, sendChatMessage, isChatOpen, toggleChat, showPredefinedBtns } = useApp();
  const { isAdmin } = useAuth();

  if (isAdmin) return null;
  const [input, setInput] = useState('');
  const msgsEndRef = useRef(null);

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  function handleSend() {
    if (!input.trim()) return;
    sendChatMessage(input);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend();
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      {isChatOpen && (
        <div
          className="bg-white border text-sm border-[#E2E8F0] rounded-lg shadow-xl w-80 mb-4 flex flex-col"
          style={{ height: '400px' }}
        >
          <div className="bg-theme-gradient text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Agent Assistant
            </h3>
            <button onClick={toggleChat} className="text-blue-200 hover:text-white transition-colors">&times;</button>
          </div>
          <div className="flex-grow p-3 overflow-y-auto bg-theme-bg flex flex-col gap-3">
            {chatMessages.length === 0 && (
              <div className="bg-white border border-[#E2E8F0] p-2 rounded-lg max-w-[85%] self-start text-theme-body">
                Hello! I am your automated assistant. How can I help you regarding our services today?
              </div>
            )}
            {chatMessages.map((m, i) => (
              <div
                key={i}
                className={
                  m.sender === 'user'
                    ? 'bg-theme-brand text-white p-2 rounded-lg max-w-[85%] self-end text-sm break-words'
                    : 'bg-white border border-[#E2E8F0] p-2 rounded-lg max-w-[85%] self-start text-theme-body text-sm break-words'
                }
              >
                {m.text}
              </div>
            ))}
            {showPredefinedBtns && chatMessages.length === 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => sendChatMessage('What are the Savings schemes?')}
                  className="bg-[#DBEAFE] text-[#1D4ED8] text-xs px-2 py-1 border border-[#BFDBFE] rounded hover:bg-[#BFDBFE] mb-1"
                >
                  Savings Info
                </button>
                <button
                  type="button"
                  onClick={() => sendChatMessage('How to apply for Credit?')}
                  className="bg-[#DBEAFE] text-[#1D4ED8] text-xs px-2 py-1 border border-[#BFDBFE] rounded hover:bg-[#BFDBFE] mb-1"
                >
                  Credit Info
                </button>
                <button
                  type="button"
                  onClick={() => sendChatMessage('I need to contact Admin.')}
                  className="bg-[#DBEAFE] text-[#1D4ED8] text-xs px-2 py-1 border border-[#BFDBFE] rounded hover:bg-[#BFDBFE] mb-1"
                >
                  Contact Admin
                </button>
              </div>
            )}
            <div ref={msgsEndRef} />
          </div>
          <div className="p-3 border-t border-[#E2E8F0] bg-white rounded-b-lg flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="input-field !py-2 text-sm flex-grow mb-0 pb-2"
            />
            <button onClick={handleSend} className="bg-theme-brand text-white px-3 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        className="chat-btn"
      >
        <div className="chat-btn-dot" />
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </div>
  );
}
