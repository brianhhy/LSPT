import React, { useState, useEffect } from 'react';

function AiChatBox() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const initialMessages = [
      { id: 1, text: '안녕하세요 할머니를 부탁해입니다.', sender: 'master' },
      { id: 2, text: '피드백 받고 싶은 신체정보를 입력해주세요.', sender: 'master' },
    ];

    let timeoutIds = [];

    initialMessages.forEach((message, index) => {
      const timeoutId = setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { ...message, show: true }]);
      }, (index + 1) * 1000); // 컴포넌트가 로드되고 1초 뒤에 첫 메시지가 나오도록 설정
      timeoutIds.push(timeoutId);
    });

    // Clean up the timeouts if the component is unmounted
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: 'You', show: true }]);
      setInput('');
    }
  };

  return (
    <div
      className="border rounded-lg overflow-hidden m-4 shadow-lg mx-auto"
      style={{ width: '600px', height: '900px' }} // 가로 1.5배, 세로 2배로 고정
    >
      <div className="sticky top-0 z-50 border-b border-gray-300 bg-white py-5 px-8 text-left text-sm text-gray-800">
        <h4 className="inline-block py-1 text-left font-sans font-semibold normal-case">AI 상담 서비스</h4>
      </div>
      <div className="flex-grow px-8 pt-8 text-left text-gray-700 overflow-y-auto" style={{ height: 'calc(100% - 150px)' }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`relative mb-6 text-left ${msg.sender === 'You' ? 'text-right' : ''} ${msg.show ? 'fade-in' : ''}`}
            style={{ opacity: msg.show ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
          >
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
          className="relative inline-flex h-10 w-auto flex-initial cursor-pointer items-center justify-center self-center rounded-md bg-blue-700 px-6 text-center align-middle text-sm font-medium text-white outline-none focus:ring-2"
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

export default AiChatBox;
