import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tripData, setTripData] = useState([]);
  const messagesEndRef = useRef(null);

  // Load trip data when component mounts
  useEffect(() => {
    loadTripData();
  }, []);

  const loadTripData = async () => {
    try {
      console.log('Fetching trip data...'); // DEBUG
      const response = await axios.get('http://localhost:6007/api/trips');
      console.log('Trip data response:', response.data); // DEBUG
      
      if (response.data.success) {
        console.log('Setting trip data:', response.data.data.trips); // DEBUG
        setTripData(response.data.data.trips);
      } else {
        console.log('No success in response'); // DEBUG
      }
    } catch (error) {
      console.error('Error loading trip data:', error); // DEBUG
      // Don't show error to user, just log it
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      console.log('Opening chatbot, trip data available:', tripData.length); // DEBUG
      setMessages([{
        type: 'bot',
        text: `Hello! 👋 I'm your Tunisia Travel Assistant. I can help you with:\n\n🗺️ Trip destinations and details\n💰 Pricing information\n📅 Available dates\n🌟 Featured trips\n🎒 Travel recommendations\n\nYou have ${tripData.length} trips available to explore!`
      }]);
    }
  }, [isOpen, tripData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log('Submitting message:', input); // DEBUG
    console.log('Trip data being sent:', tripData.length, 'trips'); // DEBUG

    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:6007/api/trips/chatbot', {
        message: input,
        tripData: tripData
      });

      console.log('Chatbot response:', response.data); // DEBUG

      if (response.data.success) {
        setMessages(prev => [...prev, { type: 'bot', text: response.data.response }]);
      }
    } catch (error) {
      console.error('Chatbot error:', error); // DEBUG
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: "Sorry, I'm having trouble connecting. Please try again later."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickReplies = [
    "What trips do you have?",
    "Show me featured trips",
    "What's the cheapest trip?",
    "When can I travel?",
    "Tell me about Sahara trips"
  ];

  const sendQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`chatbot-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-title">
            <span className="chatbot-icon">🤖</span>
            <div>
              <h4>Tunisia Travel Assistant</h4>
              <small>Ask me about trips!</small>
            </div>
          </div>
          <button 
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              <div className="message-bubble">
                {message.type === 'bot' && <span className="message-icon">🤖</span>}
                <span className="message-text">{message.text}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot typing">
              <div className="message-bubble">
                <span className="message-icon">🤖</span>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="chatbot-quick-replies">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              className="quick-reply"
              onClick={() => sendQuickReply(reply)}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="chatbot-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about trips..."
            className="chatbot-input-field"
          />
          <button type="submit" className="chatbot-send" disabled={!input.trim()}>
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatBot;