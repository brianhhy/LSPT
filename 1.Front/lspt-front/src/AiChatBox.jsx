import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AiChatBox() {
  const [messages, setMessages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [feedbackOptions, setFeedbackOptions] = useState({
    bodyInfo: true,  // 신체정보 체크박스 기본 체크 상태 (해제 불가)
    heartRate: false,
    breathingRate: false,
    stepCount: false,
  });

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

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  const [input, setInput] = useState('');


  /*-----------------------------------↓대영수정--------------------------------------------------*/
  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: messages.length + 1, text: input, sender: 'You', show: true };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);  // 대화 히스토리를 업데이트합니다.
      setInput('');
  
      // POST 요청을 보냄
      try {
        const response = await fetch('https://localhost:8443/consult', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',  // 쿠키를 포함하여 요청
          body: JSON.stringify({
            messages: updatedMessages.map(m => ({
              role: m.sender === 'You' ? 'user' : 'assistant',
              content: m.text
            }))
          }),  // 대화 히스토리를 API 요청에 포함합니다.
        });
  
        if (response.ok) {
          const result = await response.json();
          const gptMessage = result.message;  // 응답에서 메시지 추출
          setMessages(prevMessages => [
            ...prevMessages,
            { id: prevMessages.length + 1, text: gptMessage, sender: 'master', show: true },
          ]);
        } else {
          setMessages(prevMessages => [
            ...prevMessages,
            { id: prevMessages.length + 1, text: '서버에서 응답을 받을 수 없습니다.', sender: 'master', show: true },
          ]);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: '메시지를 보내는 중 오류가 발생했습니다.', sender: 'master', show: true },
        ]);
      }
    }
  };
  


  /*----------------------------------------↑대영수정------------------------------------------------------*/

  const handleOptionChange = (event) => {
    setFeedbackOptions({
      ...feedbackOptions,
      [event.target.name]: event.target.checked,
    });
  };


  /*--------------------------------------------↓대영수정-------------------------------------------------------*/
  const fetchData = async () => {
    if (!selectedDate) {
      setMessages([...messages, { id: messages.length + 1, text: '날짜를 선택해주세요.', sender: 'master', show: true }]);
      return;
    }
  
    const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    const apiCalls = [];
  
    console.log('Selected options:', feedbackOptions);
    console.log('Selected date:', formattedDate);
  
    // 각 API 호출에 쿠키 포함
    const fetchOptions = {
      method: 'GET',
      credentials: 'include',  // 쿠키를 포함하여 요청
    };
  
    if (feedbackOptions.bodyInfo) {
      console.log('Calling body info API...');
      apiCalls.push(fetch('https://localhost:8443/api/profile', fetchOptions).then(res => res.json()));
    }
    if (feedbackOptions.heartRate) {
      console.log('Calling heart rate API...');
      apiCalls.push(fetch(`https://localhost:8443/api/heartrate/time?date=${formattedDate}`, fetchOptions).then(res => res.json()));
    }
    if (feedbackOptions.breathingRate) {
      console.log('Calling breathing rate API...');
      apiCalls.push(fetch(`https://localhost:8443/api/breathing_rate?date=${formattedDate}`, fetchOptions).then(res => res.json()));
    }
    if (feedbackOptions.stepCount) {
      console.log('Calling step count API...');
      apiCalls.push(fetch(`https://localhost:8443/api/activities?date=${formattedDate}`, fetchOptions).then(res => res.json()));
    }
  
    try {
      const responses = await Promise.all(apiCalls);
      let responseData = {};
  
      // 각 API 응답을 하나의 객체로 합치기
      responses.forEach((data, index) => {
        if (index === 0 && feedbackOptions.bodyInfo) {
          // 신체정보 데이터 파싱
          const { age, gender, height, weight, strideLengthRunning, stridelengthWalking } = data.user;
          responseData = {
            ...responseData,
            age,
            gender,
            height,
            weight,
            strideLengthRunning,
            stridelengthWalking
          };
        } else if (feedbackOptions.heartRate && index === 1) {
          responseData.heartRate = data;  // 심박수 데이터 추가
        } else if (feedbackOptions.breathingRate && index === 2) {
          responseData.breathingRate = data;  // 호흡률 데이터 추가
        } else if (feedbackOptions.stepCount && index === 3) {
          responseData.stepCount = data;  // 걸음걸이 데이터 추가
        }
      });
  
      // 모든 데이터를 POST 요청으로 전송
      const postResponse = await fetch('https://localhost:8443/consult-health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // 쿠키를 포함하여 요청
        body: JSON.stringify(responseData),
      });
  
      if (postResponse.ok) {
        const result = await postResponse.json();
        const messageContent = result.message; // message 내용만 추출
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: messageContent, sender: 'master', show: true },
        ]);
      } else {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: 'POST 요청이 실패했습니다.', sender: 'master', show: true },
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: '데이터를 불러오는 중 오류가 발생했습니다.', sender: 'master', show: true },
      ]);
    }
  };

  /*--------------------------------------------------↑대영수정---------------------------------------------------------*/

  return (
    <div className="flex">
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
              <div className={`inline-block rounded-md py-3 px-4 ${msg.sender === 'You' ? 'bg-blue-700 text-white' : 'bg-white text-black'}`}>
                <p className="text-base">{msg.text}</p>
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
            className="mr-4 ml-2 overflow-hidden w-full flex-1 cursor-text resize-none whitespace-pre-wrap rounded-md bg-white text-base py-2 sm:py-0 font-normal text-gray-600 opacity-70 shadow-none outline-none focus:text-gray-600 focus:opacity-100 h-10"
            style={{ fontSize: '20px', padding: '12px 8px' }} // 글씨 크기와 여백 조정
          ></textarea>
          <button
            onClick={handleSend}
            className="relative inline-flex h-10 w-auto flex-initial cursor-pointer items-center justify-center self-center rounded-md bg-blue-700 px-6 text-center align-middle text-base font-medium text-white outline-none focus:ring-2 mr-2"
          >
            Send
          </button>
        </div>
        <style jsx>{`
          textarea::placeholder {
            font-size: 20px;
            padding-left: 0; /* 왼쪽 여백 줄이기 */
          }
        `}</style>
      </div>

      {/* Guide Section */}
      <div className="ml-8 p-4 border-l border-gray-300 flex flex-col" style={{ height: '900px', color: 'white' }}>
        {/* Upper Section: Additional Information */}
        <div className="flex-1 mb-8">
          <h3 className="text-xl font-semibold mb-4">추가 정보 선택</h3>
          <div className="mb-4">
            <label className="text-lg">
              <input
                type="checkbox"
                name="bodyInfo"
                checked={feedbackOptions.bodyInfo}
                disabled // 신체정보 체크박스는 해제 불가
              />
              신체정보(☆필수☆)
            </label>
          </div>
          <div className="mb-4">
            <label className="text-lg">
              <input
                type="checkbox"
                name="heartRate"
                checked={feedbackOptions.heartRate}
                onChange={handleOptionChange}
              />
              심박수
            </label>
          </div>
          <div className="mb-4">
            <label className="text-lg">
              <input
                type="checkbox"
                name="breathingRate"
                checked={feedbackOptions.breathingRate}
                onChange={handleOptionChange}
              />
              호흡률
            </label>
          </div>
          <div className="mb-4">
            <label className="text-lg">
              <input
                type="checkbox"
                name="stepCount"
                checked={feedbackOptions.stepCount}
                onChange={handleOptionChange}
              />
              걸음걸이
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-lg">조회할 날짜 선택:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy/MM/dd"
              className="w-full p-2 border border-gray-300 rounded text-lg"
            />
          </div>
          <button className="bg-blue-700 text-white p-2 rounded text-lg"
          onClick={fetchData}
          >확인</button>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4">가이드라인</h3>
          <ol className="list-decimal list-inside text-lg">
            <li>날짜에 해당하는 신체정보를 선택한다.</li>
            <ol className="list-decimal list-inside ml-4">
              <li>Fitbit Sense2에서 제공하는 심박수, 호흡률, 걸음걸이 등 피드백이 필요한 정보를 선택한다.</li>
              <li>조회할 날짜를 선택하여 어느 날짜의 건강 데이터를 상담받을지 선택한다.</li>
              <li>추가로 질문하고 싶은 내용을 입력하여 상담받는다.</li>
            </ol>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AiChatBox;
