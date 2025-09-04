/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { chatWindowVariants, messageBubbleVariants, widgetVariants } from '../hooks/useAnimationVariants';



// Define interfaces for message types
interface Message {
  id: string; // Unique ID for each message
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: 'Hello! How can I assist you with your bus ticket booking today?',
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(), // Simple unique ID
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Replace with your actual backend API endpoint for the chatbot
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/chat.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      let botResponseText = '';

      // Check if the response contains schedules
      if (data.schedules) {
        if (data.schedules.length > 0) {
          botResponseText = "Here are the upcoming bus schedules for today:\n\n";
          data.schedules.forEach((schedule: any) => {
            const departureTime = new Date(schedule.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            
            const arrivalTime = new Date(schedule.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            botResponseText += `- 🚌 **Bus Type:** ${schedule.bus_type} (${schedule.operator_name})\n`;
            botResponseText += `  📍 **Route:** ${schedule.start_location} to ${schedule.end_location}\n`;
            botResponseText += `  ⏰ **Time:** Departs at ${departureTime} and arrives at ${arrivalTime}\n`;
            botResponseText += `  💰 **Price:** ${schedule.price} MMK\n\n`;
          });
        } else {
          botResponseText = "I couldn't find any upcoming bus schedules for today. Please check back later or try tomorrow.";
        }
      } else {
        // Fallback to the regular reply from Gemini
        botResponseText = data.reply || 'Sorry, I could not get a response.';
      }

      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        sender: 'bot',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        sender: 'bot',
        text: 'Oops! Something went wrong. Please try again later.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={toggleChat}
        initial={false}
        animate={isOpen ? 'hidden' : 'visible'} // Hide button when chat window is open
        variants={widgetVariants}
      >
        <MessageSquare className="w-7 h-7" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 w-full max-w-sm h-[450px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200"
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Bot className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Bus Ticket Bot</h3>
              </div>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div
              ref={chatContainerRef}
              className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-gray-50"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageBubbleVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {/* Render text with line breaks */}
                    {msg.text.split('\n').map((line, index) => (
                      <p key={index} className="whitespace-pre-wrap">{line}</p>
                    ))}
                    <span className={`block text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-3">
                  <div className="max-w-[80%] p-3 rounded-lg shadow-sm bg-gray-200 text-gray-800 rounded-bl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <textarea
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-grow p-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none custom-scrollbar"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      sendMessage(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading || inputMessage.trim() === ''}
                >
                  <Send className="w-5 h-5 " />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
