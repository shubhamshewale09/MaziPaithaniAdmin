import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { useConversations } from '../../hooks/useConversations';
import Loader from '../../components/custom/Loader';

const getLoggedInUserId = () => {
  try {
    const login = JSON.parse(localStorage.getItem('login') || '{}');
    return login?.userId ?? login?.UserId ?? localStorage.getItem('UserId') ?? null;
  } catch {
    return null;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const ChatWindow = ({ senderId, receiverId, receiverName, roomId, onBack }) => {
  const { messages, loading, sendMessage } = useChat(senderId, receiverId, roomId);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className='flex h-[calc(100vh-280px)] min-h-[500px] flex-col'>
      <div className='flex items-center gap-3 border-b border-[#f1e2d8] p-4'>
        <button type='button' onClick={onBack} className='flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7f2] text-[#7a1e2c] lg:hidden'>
          <ArrowLeft size={16} />
        </button>
        <div className='flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white'>
          {receiverName?.[0] || '?'}
        </div>
        <div>
          <p className='text-sm font-semibold text-[#34160f]'>{receiverName}</p>
          <p className='text-xs text-[#8b6759]'>Typically replies within a few hours</p>
        </div>
      </div>

      <div className='flex-1 space-y-3 overflow-y-auto bg-[#fffaf6] p-4 [scrollbar-width:thin]'>
        {loading ? (
          <Loader />
        ) : messages.length === 0 ? (
          <p className='text-center text-sm text-[#b19588]'>No messages yet. Say hello!</p>
        ) : (
          messages.map((msg, index) => {
            const isMe = String(msg.iSenderUserId) === String(senderId);
            return (
              <div key={msg.iMessageId ?? index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={['max-w-[80%] rounded-[24px] px-4 py-3 text-sm shadow-sm', isMe ? 'rounded-br-md bg-[#7a1e2c] text-white' : 'rounded-bl-md bg-white text-[#34160f]'].join(' ')}>
                  <p>{msg.sMessage}</p>
                  <p className={['mt-2 text-[10px]', isMe ? 'text-white/70' : 'text-[#8b6759]'].join(' ')}>
                    {formatTime(msg.dSentDate)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className='border-t border-[#f1e2d8] bg-white p-4'>
        <div className='flex items-center gap-3 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-3 py-2'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder='Type a message to the artisan...'
            className='w-full bg-transparent px-2 text-sm text-[#34160f] outline-none placeholder:text-[#b19588]'
          />
          <button type='button' onClick={handleSend} className='flex h-10 w-10 items-center justify-center rounded-full bg-[#7a1e2c] text-white'>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// initialReceiverId — sellerUserId from product API (used to open a new chat directly)
// initialReceiverName — seller name shown in the chat header
const Messages = ({ initialReceiverId, initialReceiverName }) => {
  const senderId = getLoggedInUserId();
  const { conversations, loading: convLoading } = useConversations();
  const [activeConv, setActiveConv] = useState(null);

  // If customer clicked "Chat" on a product card, open that seller directly.
  // First try to find an existing conversation, otherwise create a virtual one.
  useEffect(() => {
    if (!initialReceiverId) return;

    // Try to match existing conversation by otherUserId
    const match = conversations.find(
      (c) => String(c.otherUserId ?? c.receiverId) === String(initialReceiverId),
    );

    if (match) {
      setActiveConv(match);
    } else {
      // No existing conversation — open a fresh chat window directly
      setActiveConv({
        roomId: null,
        otherUserId: initialReceiverId,
        otherUserName: initialReceiverName ?? 'Seller',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialReceiverId, initialReceiverName]);

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>Seller conversations</p>
        <h1 className='mt-2 text-3xl font-bold text-[#34160f]'>Chat with artisans from one place</h1>
        <p className='mt-3 text-sm leading-7 text-[#8b6759]'>
          Real-time messaging powered by SignalR. Messages sync instantly across devices.
        </p>
      </section>

      <section className='overflow-hidden rounded-[32px] border border-[#efdcd2] bg-white shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <div className='grid h-[calc(100vh-280px)] min-h-[500px] lg:grid-cols-[320px_1fr]'>

          {/* Sidebar */}
          <aside className={['flex flex-col border-r border-[#f1e2d8]', activeConv ? 'hidden lg:flex' : 'flex'].join(' ')}>
            <div className='shrink-0 border-b border-[#f1e2d8] p-4'>
              <p className='text-lg font-bold text-[#34160f]'>Conversations</p>
            </div>

            {convLoading ? (
              <div className='p-6'><Loader /></div>
            ) : conversations.length === 0 ? (
              <div className='p-6 text-center text-sm text-[#b19588]'>No conversations yet.</div>
            ) : (
              <div className='flex-1 divide-y divide-[#f1e2d8] overflow-y-auto [scrollbar-width:thin]'>
                {conversations.map((conv) => {
                  const name = conv.otherUserName ?? conv.sellerName ?? '?';
                  const isActive = activeConv?.roomId === conv.roomId;
                  return (
                    <button
                      key={conv.roomId}
                      type='button'
                      onClick={() => setActiveConv(conv)}
                      className={['flex w-full items-start gap-3 p-4 text-left transition', isActive ? 'bg-[#fff7f2]' : 'hover:bg-[#fffaf6]'].join(' ')}
                    >
                      <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white'>
                        {name[0]}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-center justify-between gap-2'>
                          <p className='truncate text-sm font-semibold text-[#34160f]'>{name}</p>
                          {conv.lastMessageTime && (
                            <span className='shrink-0 text-[10px] text-[#8b6759]'>{formatTime(conv.lastMessageTime)}</span>
                          )}
                        </div>
                        {conv.lastMessage && (
                          <p className='mt-1 truncate text-xs text-[#8b6759]'>{conv.lastMessage}</p>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7a1e2c] px-1 text-[10px] font-bold text-white'>
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          {/* Chat area */}
          {activeConv ? (
            <ChatWindow
              key={`${activeConv.roomId}-${activeConv.otherUserId}`}
              senderId={senderId}
              receiverId={activeConv.otherUserId ?? activeConv.receiverId}
              receiverName={activeConv.otherUserName ?? activeConv.sellerName}
              roomId={activeConv.roomId}
              onBack={() => setActiveConv(null)}
            />
          ) : (
            <div className='hidden h-full flex-1 items-center justify-center bg-[#fffaf6] p-10 text-center lg:flex'>
              <div>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-2xl shadow-sm'>💬</div>
                <p className='mt-4 text-lg font-bold text-[#34160f]'>Select a conversation</p>
                <p className='mt-2 text-sm text-[#8b6759]'>Choose any artisan from the left to continue chatting.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Messages;
