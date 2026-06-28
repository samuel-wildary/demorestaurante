import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from './openaiService';
import { menuData } from './menuData';
import { ShoppingCart, Send, MoreVertical, Phone, Video, ChevronLeft, Mic, Paperclip, Camera, Smile, Store, Check, CheckCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const formatMessage = (text) => {
  if (!text) return null;
  // Convert markdown bold (**text** or *text*) to HTML bold
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<b>$1</b>');
  // Handle new lines
  formattedText = formattedText.replace(/\n/g, '<br/>');
  return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Olá! 👋 Sou a *Bella*, assistente virtual da *Bella Italia* 🍕🍔.\nComo posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderFinalized, setOrderFinalized] = useState(false);
  const messagesEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = "gpt-5.4-mini-2026-03-17";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const cartFunctions = {
    addToCart: (item_id, quantity, flavors, notes) => {
      const item = menuData.items.find(i => i.id === item_id);
      if (!item) throw new Error("Item não encontrado");
      const newItem = { ...item, quantity, flavors, notes, cart_item_id: Math.random().toString(36).substr(2, 9) };
      setCart(prev => [...prev, newItem]);
      return newItem;
    },
    removeFromCart: (cart_item_id) => {
      setCart(prev => prev.filter(i => i.cart_item_id !== cart_item_id));
    },
    clearCart: () => {
      setCart([]);
    },
    finalizeOrder: (customer_name, delivery_address, payment_method) => {
      setOrderFinalized(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#25D366', '#ffffff']
      });
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setOrderFinalized(false);

    try {
      const response = await sendChatMessage({
        apiKey,
        model,
        messages: newMessages,
        cart,
        cartFunctions,
        onSystemMessage: (msg) => console.log(msg)
      });

      setMessages(response.updatedHistory);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Desculpe, ocorreu um erro de conexão. Poderia repetir?' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans sm:p-8">
      
      {/* Background glow effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-whatsapp-light/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-whatsapp-teal/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Phone Mockup Container */}
      <div className="w-full max-w-[400px] h-[850px] max-h-full sm:max-h-[850px] bg-[#0b141a] rounded-[2.5rem] border-[10px] border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col mx-auto ring-1 ring-white/10">
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-800 rounded-b-3xl z-50"></div>

        {/* WhatsApp Header */}
        <div className="bg-[#202c33] text-white flex items-center justify-between px-3 py-3 pt-8 shadow-sm z-40 relative">
          <div className="flex items-center gap-2">
            <button className="p-1 rounded-full hover:bg-white/10 transition">
              <ChevronLeft size={24} />
            </button>
            <div className="relative">
              <div className="w-10 h-10 bg-whatsapp-teal rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden border border-white/20">
                <Store size={20} />
              </div>
            </div>
            <div className="flex flex-col ml-1 cursor-pointer" onClick={() => setShowCart(!showCart)}>
              <span className="font-semibold text-[16px] leading-tight text-zinc-100">Bella Italia 🍕</span>
              <span className="text-xs text-zinc-400">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-zinc-300">
            <Video size={20} className="cursor-pointer hover:text-white transition" />
            <Phone size={18} className="cursor-pointer hover:text-white transition" />
            <MoreVertical size={20} className="cursor-pointer hover:text-white transition" />
          </div>
        </div>

        {/* Chat Area (WhatsApp Pattern Background) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 whatsapp-bg relative bg-[#0b141a]">
          
          {/* Encryption Message */}
          <div className="flex justify-center mb-6 mt-2">
            <div className="bg-[#182229] text-[#ffd279] text-xs px-3 py-1.5 rounded-lg max-w-[85%] text-center flex items-center gap-2 shadow-sm border border-white/5">
              <span>🔒 As mensagens e as chamadas são protegidas com a criptografia de ponta a ponta.</span>
            </div>
          </div>

          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[85%] px-3 py-2 text-[15px] shadow-sm ${
                  isUser 
                    ? 'bg-[#005c4b] text-white rounded-l-lg rounded-br-lg rounded-tr-sm' 
                    : 'bg-[#202c33] text-zinc-100 rounded-r-lg rounded-bl-lg rounded-tl-sm'
                }`}>
                  {/* Tail for first message in group (simplified) */}
                  <div className={`absolute top-0 w-3 h-3 ${isUser ? '-right-2' : '-left-2'} overflow-hidden`}>
                    <div className={`w-4 h-4 -mt-2 ${isUser ? '-ml-2 bg-[#005c4b] rounded-bl-full' : 'bg-[#202c33] rounded-br-full'}`}></div>
                  </div>
                  
                  <div className="leading-snug break-words">
                    {formatMessage(msg.content)}
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-white/60">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isUser && <CheckCheck size={14} className="text-[#53bdeb]" />}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#202c33] px-4 py-3 rounded-r-lg rounded-bl-lg rounded-tl-sm text-zinc-400 flex gap-1 items-center relative">
                 <div className="absolute top-0 -left-2 w-3 h-3 overflow-hidden">
                    <div className="w-4 h-4 -mt-2 bg-[#202c33] rounded-br-full"></div>
                  </div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Cart Button (WhatsApp style floating action) */}
        {cart.length > 0 && (
          <div className="absolute bottom-[80px] right-4 z-40">
            <button 
              onClick={() => setShowCart(true)}
              className="bg-whatsapp-light text-[#0b141a] p-3 rounded-full shadow-lg hover:scale-105 transition flex items-center justify-center relative"
            >
              <ShoppingCart size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0b141a]">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-[#202c33] p-2 flex items-end gap-2 relative z-40">
          <div className="flex-1 bg-[#2a3942] rounded-[24px] flex items-end px-3 py-2 min-h-[44px]">
            <button className="text-zinc-400 hover:text-white pb-1 pr-2 transition">
              <Smile size={24} />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Mensagem"
              className="flex-1 bg-transparent text-white outline-none resize-none max-h-32 text-[15px] leading-tight py-1"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '24px'
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
              }}
            />
            <div className="flex items-center gap-3 text-zinc-400 pb-1 pl-2">
              <Paperclip size={20} className="cursor-pointer hover:text-white transition transform -rotate-45" />
              {!input.trim() && <Camera size={22} className="cursor-pointer hover:text-white transition" />}
            </div>
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              input.trim() 
                ? 'bg-whatsapp-light text-[#0b141a] hover:bg-emerald-400' 
                : 'bg-whatsapp-light text-[#0b141a]' // Usually mic icon when empty, but let's keep it simple
            }`}
          >
            {input.trim() ? <Send size={20} className="ml-1" /> : <Mic size={24} />}
          </button>
        </div>

        {/* Cart Drawer / Overlay */}
        {showCart && (
          <div className="absolute inset-0 bg-[#0b141a]/90 backdrop-blur-sm z-50 flex flex-col transition-all duration-300 animate-in fade-in slide-in-from-bottom-8">
            <div className="bg-[#202c33] p-4 flex items-center gap-4 text-white shadow-md pt-8">
              <button onClick={() => setShowCart(false)} className="hover:bg-white/10 p-1 rounded-full">
                <ChevronLeft size={28} />
              </button>
              <h2 className="text-xl font-semibold flex-1">Seu Pedido</h2>
              <ShoppingCart size={24} className="text-whatsapp-light" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 text-white">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
                  <UtensilsCrossed size={48} className="opacity-50" />
                  <p>Seu carrinho está vazio.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="bg-[#202c33] p-3 rounded-xl flex items-center justify-between border border-white/5">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-whatsapp-light">
                          {item.quantity}x R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-bold text-lg">
                        R$ {(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-white/10 pt-4 mt-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-whatsapp-light">R$ {calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 bg-[#202c33]">
                <button 
                  onClick={() => setShowCart(false)}
                  className="w-full bg-whatsapp-light text-[#0b141a] py-3 rounded-full font-bold text-lg hover:bg-emerald-400 transition"
                >
                  Continuar no Chat
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
