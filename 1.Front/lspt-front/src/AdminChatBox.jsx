import React, { useState } from 'react';

function AdminChatBox() {
  const [messages, setMessages] = useState([

  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'You' }]);
      setInput('');
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden m-4 shadow-lg mx-auto"
      style={{ width: '600px', height: '900px' }} // 가로 1.5배, 세로 2배로 고정
    >
      <div className="sticky top-0 z-50 border-b border-gray-300 bg-white py-5 px-8 text-left text-sm text-gray-800">
        <h4 className="inline-block py-1 text-left font-sans font-semibold normal-case">관리자 상담 서비스</h4>
      </div>
      <div className="flex-grow px-8 pt-8 text-left text-gray-700 overflow-y-auto" style={{ height: 'calc(100% - 150px)' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`relative mb-6 text-left ${msg.sender === 'You' ? 'text-right' : ''}`}>
            <div className={`inline-block rounded-md py-3 px-4 ${msg.sender === 'You' ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start border-t border-gray-300 py-4 text-left text-gray-700">
        <textarea
          cols="1"
          rows="1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메세지를 입력해주세요"
          className="mr-4 ml-2 overflow-hidden w-full flex-1 cursor-text resize-none whitespace-pre-wrap rounded-md bg-white text-sm py-2 sm:py-0 font-normal text-gray-600 opacity-70 shadow-none outline-none focus:text-gray-600 focus:opacity-100 h-10"
          style={{ fontSize: '18px', padding: '12px 8px' }} // 글씨 크기와 여백 조정
        ></textarea>
        <button
          onClick={handleSend}
          className="relative mr-5 inline-flex h-10 w-auto flex-initial cursor-pointer items-center justify-center self-center rounded-md bg-blue-700 px-6 text-center align-middle text-sm font-medium text-white outline-none focus:ring-2"
        >
          Send
        </button>
      </div>
      <style jsx>{`
        textarea::placeholder {
          font-size: 18px;
          padding-left: 0; /* 왼쪽 여백 줄이기 */
        }
      `}</style>
    </div>
  );
}

export default AdminChatBox;
