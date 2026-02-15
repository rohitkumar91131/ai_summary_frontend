import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../ui/Header';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function Ask() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch article details
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/article/${id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setArticle(data);
          // Add initial greeting
          setMessages([{ role: 'ai', text: `Hello! I've read "${data.title}". Ask me anything about it.` }]);
        }
        else toast.error('Failed to load article');
      } catch (err) {
        toast.error('Error loading article');
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/article/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ articleId: id, question: userMsg.text })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.answer }]);
      } else {
        toast.error(data.message || 'Failed to get answer');
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I couldn't process that request." }]);
      }
    } catch (err) {
      toast.error('Network error');
      setMessages(prev => [...prev, { role: 'ai', text: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!article) return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 mt-[70px] grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-70px)]">

        {/* Article Context Section (Left/Top) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto h-full hidden lg:block">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">{article.title}</h1>
          <div className="prose prose-slate max-w-none">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Summary</h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{article.summary}</p>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Content Preview</h3>
              <p className="text-slate-600 text-sm line-clamp-[10] italic">{article.content}</p>
            </div>
          </div>
        </div>

        {/* Chat Section (Right/Bottom) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center lg:hidden">
            <h2 className="font-semibold text-slate-700 truncate">{article.title}</h2>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                  {msg.role === 'user' ? <User size={16} className="text-blue-600" /> : <Bot size={16} className="text-purple-600" />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-700 rounded-tl-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-purple-600" />
                </div>
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about this article..."
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>

      </main>
    </div>
  );
}

export default Ask;
