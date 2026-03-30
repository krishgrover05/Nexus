import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Bot, User, Key, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hi! 👋 I'm **Nexus AI**, powered by Google Gemini. Ask me anything!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(() => !localStorage.getItem('gemini_api_key'));
  const [keyDraft, setKeyDraft] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null); // Gemini chat session

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !showKeyInput) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, showKeyInput]);

  // Initialize Gemini chat session when API key changes
  useEffect(() => {
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        chatRef.current = model.startChat({
          history: [],
          generationConfig: { maxOutputTokens: 1024 },
        });
        setError('');
      } catch (err) {
        setError('Failed to initialize Gemini. Check your API key.');
        chatRef.current = null;
      }
    }
  }, [apiKey]);

  const saveApiKey = () => {
    const key = keyDraft.trim();
    if (!key) return;
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowKeyInput(false);
    setKeyDraft('');
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    if (!apiKey || !chatRef.current) {
      setShowKeyInput(true);
      return;
    }

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError('');

    try {
      const result = await chatRef.current.sendMessage(text);
      const response = await result.response;
      const responseText = response.text();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: responseText },
      ]);
    } catch (err) {
      console.error('Gemini API error:', err);
      const errMsg =
        err.message?.includes('API_KEY_INVALID') || err.message?.includes('401')
          ? 'Invalid API key. Please update your key.'
          : 'Something went wrong. Please try again.';
      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `⚠️ ${errMsg}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown rendering (bold and line breaks)
  const renderContent = (text) => {
    return text.split('\n').map((line, li) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={li}>
          {li > 0 && <br />}
          {parts.map((part, pi) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pi} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pi}>{part}</span>;
          })}
        </span>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Chat window */}
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[700px] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-neutral-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white text-base">Nexus AI</h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                Powered by Gemini
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyInput((v) => !v)}
              title="API Key Settings"
              className="size-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors text-neutral-400 hover:text-white"
            >
              <Key className="size-4" />
            </button>
            <button
              onClick={onClose}
              className="size-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors text-neutral-400 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* API Key Input Banner */}
        {showKeyInput && (
          <div className="px-6 py-4 bg-indigo-950/50 border-b border-indigo-500/20">
            <div className="flex items-start gap-3 mb-3">
              <AlertCircle className="size-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-indigo-200 font-medium">Enter your Gemini API Key</p>
                <p className="text-xs text-indigo-300/60 mt-1">
                  Get a free key at{' '}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-indigo-200 transition-colors"
                  >
                    aistudio.google.com/apikey
                  </a>
                  . Your key is stored locally in your browser.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
                placeholder="AIzaSy..."
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={saveApiKey}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="size-4" />
                ) : (
                  <User className="size-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'assistant'
                    ? 'bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-tl-md'
                    : 'bg-indigo-600 text-white rounded-tr-md shadow-lg shadow-indigo-500/20'
                }`}
              >
                {renderContent(msg.content)}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Bot className="size-4" />
              </div>
              <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-md">
                <div className="flex gap-1.5">
                  <span className="size-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="size-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="size-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-neutral-800/80 bg-neutral-900/30">
          <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 focus-within:border-indigo-500/50 focus-within:shadow-[0_0_15px_rgba(99,102,241,0.1)] transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={apiKey ? 'Type your message...' : 'Set your API key first...'}
              disabled={!apiKey}
              className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || !apiKey}
              className="size-9 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 flex items-center justify-center transition-all text-white shrink-0"
            >
              <Send className="size-4" />
            </button>
          </div>
          <p className="text-[11px] text-neutral-600 text-center mt-2">
            Powered by Google Gemini 2.0 Flash
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
