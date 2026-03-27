import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';

const CONVERSATIONS = [
  { id: 1, seller: 'Ravi Handlooms', last: 'Your saree is ready for dispatch.', time: '2m ago', unread: 2 },
  { id: 2, seller: 'Sunita Weaves', last: 'Thanks for confirming the bridal shade.', time: '1h ago', unread: 0 },
  { id: 3, seller: 'Mohan Silk House', last: 'Custom motif can be woven in 3 weeks.', time: '3h ago', unread: 1 },
];

const INITIAL_MESSAGES = {
  1: [
    { from: 'seller', text: 'Hello, your saree is ready for dispatch.', time: '10:00 AM' },
    { from: 'me', text: 'Great, please share the dispatch update once booked.', time: '10:03 AM' },
  ],
  2: [
    { from: 'seller', text: 'Thanks for confirming the bridal shade.', time: 'Yesterday' },
    { from: 'me', text: 'Please keep the blouse piece matched to the border.', time: 'Yesterday' },
  ],
  3: [
    { from: 'seller', text: 'Custom motif can be woven in 3 weeks.', time: '3h ago' },
    { from: 'me', text: 'That timeline works for me.', time: '2h ago' },
  ],
};

const Messages = ({ initialSeller }) => {
  const getInitialConversationId = () => {
    const matchedConversation = CONVERSATIONS.find((item) => item.seller === initialSeller);
    return matchedConversation?.id || CONVERSATIONS[0].id;
  };

  const [activeConversationId, setActiveConversationId] = useState(getInitialConversationId);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!initialSeller) {
      return;
    }

    const matchedConversation = CONVERSATIONS.find((item) => item.seller === initialSeller);
    if (matchedConversation) {
      setActiveConversationId(matchedConversation.id);
    }
  }, [initialSeller]);

  const activeConversation = useMemo(
    () => CONVERSATIONS.find((item) => item.id === activeConversationId),
    [activeConversationId],
  );

  const handleSend = () => {
    if (!input.trim() || !activeConversationId) {
      return;
    }

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] || []),
        { from: 'me', text: input.trim(), time: 'Now' },
      ],
    }));
    setInput('');
  };

  return (
    <div className='space-y-6'>
      <section className='rounded-[32px] border border-[#efdcd2] bg-white p-6 shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#a6806f]'>
          Seller conversations
        </p>
        <h1 className='mt-2 text-3xl font-bold text-[#34160f]'>Chat with artisans from one place</h1>
        <p className='mt-3 text-sm leading-7 text-[#8b6759]'>
          The messaging experience now fits the customer layout and works better on mobile.
        </p>
      </section>

      <section className='overflow-hidden rounded-[32px] border border-[#efdcd2] bg-white shadow-[0_18px_45px_rgba(94,35,23,0.08)]'>
        <div className='grid min-h-[620px] lg:grid-cols-[320px_1fr]'>
          <aside
            className={[
              'border-r border-[#f1e2d8]',
              activeConversationId ? 'hidden lg:block' : 'block',
            ].join(' ')}
          >
            <div className='border-b border-[#f1e2d8] p-4'>
              <p className='text-lg font-bold text-[#34160f]'>Conversations</p>
            </div>
            <div className='divide-y divide-[#f1e2d8]'>
              {CONVERSATIONS.map((conversation) => (
                <button
                  key={conversation.id}
                  type='button'
                  onClick={() => setActiveConversationId(conversation.id)}
                  className={[
                    'flex w-full items-start gap-3 p-4 text-left transition',
                    activeConversationId === conversation.id ? 'bg-[#fff7f2]' : 'hover:bg-[#fffaf6]',
                  ].join(' ')}
                >
                  <div className='flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white'>
                    {conversation.seller[0]}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='truncate text-sm font-semibold text-[#34160f]'>
                        {conversation.seller}
                      </p>
                      <span className='text-[10px] text-[#8b6759]'>{conversation.time}</span>
                    </div>
                    <p className='mt-1 truncate text-xs text-[#8b6759]'>{conversation.last}</p>
                  </div>
                  {conversation.unread ? (
                    <span className='flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7a1e2c] px-1 text-[10px] font-bold text-white'>
                      {conversation.unread}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </aside>

          <div className='flex min-h-[620px] flex-col'>
            {activeConversation ? (
              <>
                <div className='flex items-center gap-3 border-b border-[#f1e2d8] p-4'>
                  <button
                    type='button'
                    onClick={() => setActiveConversationId(null)}
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7f2] text-[#7a1e2c] lg:hidden'
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className='flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#7a1e2c] to-[#c28b1e] text-sm font-bold text-white'>
                    {activeConversation.seller[0]}
                  </div>
                  <div>
                    <p className='text-sm font-semibold text-[#34160f]'>
                      {activeConversation.seller}
                    </p>
                    <p className='text-xs text-[#8b6759]'>Typically replies within a few hours</p>
                  </div>
                </div>

                <div className='flex-1 space-y-3 overflow-y-auto bg-[#fffaf6] p-4'>
                  {(messages[activeConversationId] || []).map((message, index) => (
                    <div
                      key={`${message.time}-${index}`}
                      className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={[
                          'max-w-[80%] rounded-[24px] px-4 py-3 text-sm shadow-sm',
                          message.from === 'me'
                            ? 'rounded-br-md bg-[#7a1e2c] text-white'
                            : 'rounded-bl-md bg-white text-[#34160f]',
                        ].join(' ')}
                      >
                        <p>{message.text}</p>
                        <p
                          className={[
                            'mt-2 text-[10px]',
                            message.from === 'me' ? 'text-white/70' : 'text-[#8b6759]',
                          ].join(' ')}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='border-t border-[#f1e2d8] bg-white p-4'>
                  <div className='flex items-center gap-3 rounded-full border border-[#ead9cf] bg-[#fffaf6] px-3 py-2'>
                    <input
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          handleSend();
                        }
                      }}
                      placeholder='Type a message to the artisan...'
                      className='w-full bg-transparent px-2 text-sm text-[#34160f] outline-none placeholder:text-[#b19588]'
                    />
                    <button
                      type='button'
                      onClick={handleSend}
                      className='flex h-10 w-10 items-center justify-center rounded-full bg-[#7a1e2c] text-white'
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className='hidden h-full flex-1 items-center justify-center bg-[#fffaf6] p-10 text-center lg:flex'>
                <div>
                  <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-white text-2xl shadow-sm'>
                    S
                  </div>
                  <p className='mt-4 text-lg font-bold text-[#34160f]'>Select a conversation</p>
                  <p className='mt-2 text-sm text-[#8b6759]'>
                    Choose any artisan from the left to continue chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Messages;
