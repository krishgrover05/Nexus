import { useState } from 'react';
import { Zap, Shield, Sparkles, ArrowRight, Code, MessageCircle } from 'lucide-react';
import ChatBot from './components/ChatBot';

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="size-5 text-white" />
            </div>
            Nexus
          </div>
          <div className="flex gap-6 items-center">
            <a href="#features" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Docs</a>
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <MessageCircle className="size-4" />
              Chat
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="mx-auto w-fit mb-8 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 text-sm flex items-center gap-2 backdrop-blur-sm shadow-sm">
          <Sparkles className="size-4" />
          <span className="font-medium">AI-Powered Conversations</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Meet your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Intelligent Assistant.</span>
        </h1>

        <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Nexus AI is a smart chatbot that learns from your data and delivers instant, accurate answers. Start a conversation and experience the future of intelligent assistance.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setChatOpen(true)}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transform hover:-translate-y-0.5"
          >
            Start Chatting
            <ArrowRight className="size-4" />
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-all font-medium flex items-center gap-2 text-neutral-300 transform hover:-translate-y-0.5"
          >
            <Code className="size-4" />
            View Features
          </button>
        </div>

        {/* Feature grid */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-6 text-left border-t border-neutral-800/50 pt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-transparent pointer-events-none -z-10 blur-xl"></div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm hover:border-indigo-500/30 transition-colors group">
            <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
              <Zap className="size-6" />
            </div>
            <h3 className="font-semibold text-lg text-neutral-100 mb-3">Instant Responses</h3>
            <p className="text-neutral-400 text-sm/relaxed">Get real-time answers to your questions. Nexus AI processes your input and responds in milliseconds with intelligent, context-aware replies.</p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm hover:border-purple-500/30 transition-colors group">
            <div className="size-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all">
              <Shield className="size-6" />
            </div>
            <h3 className="font-semibold text-lg text-neutral-100 mb-3">Trainable on Your Data</h3>
            <p className="text-neutral-400 text-sm/relaxed">Upload your own datasets and documents. Nexus AI learns from your content to provide accurate, domain-specific answers tailored to your needs.</p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 backdrop-blur-sm hover:border-emerald-500/30 transition-colors group">
            <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
              <Sparkles className="size-6" />
            </div>
            <h3 className="font-semibold text-lg text-neutral-100 mb-3">Beautiful Interface</h3>
            <p className="text-neutral-400 text-sm/relaxed">A sleek, modern chat experience with typing indicators, smooth animations, and a dark-themed glassmorphic design that feels premium.</p>
          </div>
        </div>
      </main>

      {/* Floating chat button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 size-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-110 transition-all"
      >
        <MessageCircle className="size-6" />
      </button>

      {/* Chat Bot */}
      <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default App;
