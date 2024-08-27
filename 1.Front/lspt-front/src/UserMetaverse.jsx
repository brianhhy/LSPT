import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserMetaverse.css';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ManageIcon from '@mui/icons-material/ManageAccounts';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import userImg from './assets/user.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function UserMetaverse() {
  const [userData, setUserData] = useState({
    displayName: '',
    memberType: '일반 회원',
    age: '',
    weight: '',
    height: '',
    gender: '',
    averageDailySteps: '',
  });

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [headerText, setHeaderText] = useState('사용자 신체정보');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 새로운 상태 추가
  const [selectedFriend, setSelectedFriend] = useState('');

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = function () {
          const receivedMessage = JSON.parse(reader.result);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        };
        reader.readAsText(event.data);
      } else {
        let receivedMessage;
        try {
          receivedMessage = JSON.parse(event.data);
        } catch (error) {
          receivedMessage = { sender: 'System', text: event.data };
        }
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        sender: userData.displayName,
        text: inputMessage,
      };
      ws.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  const handleFriendClick = (friendName) => {
    setSelectedFriend(friendName); // 친구 이름 설정
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://localhost:8443/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          console.error('사용자 데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('API 요청 중 에러 발생:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const showToasts = !localStorage.getItem('acknowledgedToasts');

    if (showToasts) {
      const toastId1 = toast.info(
        <div style={{ fontSize: '16px', color: '#333' }}>
          키보드 <strong style={{ color: '#007BFF' }}>m</strong> 입력을 통해 <strong style={{ color: '#007BFF' }}>기능창</strong>을 활성화 할 수 있습니다!
          <button onClick={() => handleToastAcknowledge(toastId1)} style={{ marginTop: '10px', display: 'block', backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            이해 했습니다!
          </button>
        </div>,
        {
          position: "top-left",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );

      const toastId2 = toast.info(
        <div style={{ fontSize: '16px', color: '#333' }}>
          키보드 <strong style={{ color: '#007BFF' }}>c</strong> 입력을 통해 <br/><strong style={{ color: '#007BFF' }}>채팅창</strong>을 활성화 할 수 있습니다!
          <button onClick={() => handleToastAcknowledge(toastId2)} style={{ marginTop: '10px', display: 'block', backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            이해 했습니다!
          </button>
        </div>,
        {
          position: "top-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        }
      );
    }
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'm') {
        toggleLeftSidebar();
      } else if (e.key === 'c') {
        toggleRightSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const loadingElement = document.querySelector('.loading');

    const handleAnimationEnd = () => {
      setLoading(false);
    };

    if (loadingElement) {
      loadingElement.addEventListener('animationend', handleAnimationEnd);
    }

    return () => {
      if (loadingElement) {
        loadingElement.removeEventListener('animationend', handleAnimationEnd);
      }
    };
  }, []);

  const handleToastAcknowledge = (toastId) => {
    toast.dismiss(toastId);
    localStorage.setItem('acknowledgedToasts', 'true');
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
  };

  const navigateToAiChat = (activeTab) => {
    navigate('/aichat', { state: { activeTab } });
  };

  const handleSearchClick = () => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
      setHeaderText(`${formattedDate} 신체정보`);
    }
  };

  const handleHealthInfoClick = () => {
    setSelectedDate(new Date());
    setHeaderText('사용자 신체정보');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const { displayName, memberType, age, weight, gender, averageDailySteps } = userData;

  return (
    <div className="min-h-screen flex relative">
      <ToastContainer />

      {/* Left Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-between transition-transform duration-300 ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="mt-4" style={{ width: '70.5px', height: '101.5px' }} />
        </div>

        <div className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            <li className="bg-gray-100 rounded-lg">
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-700" onClick={handleHealthInfoClick}>
                <HealthAndSafetyIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium">신체정보</span>
              </a>
            </li>

            <div className="mt-6">
              <h3 className="text-lg font-bold">{headerText}</h3>
              <p className="text-sm mt-2"><strong>닉네임 : </strong> {displayName}</p>
              <p className="text-sm"><strong>회원 유형 : </strong> {memberType}</p>
              <p className="text-sm"><strong>나이 : </strong> {age}</p>
              <p className="text-sm"><strong>몸무게 : </strong> {weight}</p>
              <p className="text-sm"><strong>성별 : </strong> {gender}</p>
              <p className="text-sm"><strong>평균 걸음 : </strong> {averageDailySteps}</p>
            </div>

            <li className="hover:bg-gray-100 rounded-lg">
              <a href="#" className="flex items-center gap-2 px-4 py-2 text-gray-700" onClick={() => setShowDatePicker(!showDatePicker)}>
                <CalendarIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium">지난 신체정보</span>
              </a>

              {showDatePicker && (
                <div className="mt-1 flex items-center relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="yyyy/MM/dd"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    placeholderText="Select a date"
                    className="w-36 p-2 border border-gray-300 rounded focus:outline-none text-xs"
                  />
                  <button onClick={handleSearchClick} className="absolute right-0 p-2 bg-blue-500 text-white rounded-r whitespace-nowrap" style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                    검색
                  </button>
                </div>
              )}
            </li>

            <li className="hover:bg-gray-100 rounded-lg">
              <button onClick={() => navigateToAiChat('AI 상담 서비스')} className="group flex items-center justify-between px-4 py-2 text-gray-500 hover:text-gray-700">
                <div className="flex items-center gap-2">
                  <PsychologyIcon className="size-5 opacity-75" />
                  <span className="text-sm font-medium">AI 건강 상담</span>
                </div>
              </button>
            </li>

            <li className="hover:bg-gray-100 rounded-lg">
              <button onClick={() => navigateToAiChat('관리자 상담 서비스')} className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700">
                <ManageIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium"> 관리자 연결 </span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 p-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 bg-white hover:bg-gray-50">
            <img alt="" src={userImg} className="size-10 rounded-full object-cover" />
            <div>
              <p className="text-xs">
                <strong className="block font-medium">{displayName}</strong>
                <span>{memberType}</span>
              </p>
            </div>
          </a>
          <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
            <LogoutIcon className="size-6 opacity-75" />
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white p-8 shadow-md flex flex-col justify-between transition-transform duration-300 ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto border-b border-gray-200">
            <div className="flex items-center justify-start mb-4">
                <GroupIcon className="mr-2" />
                <h2 className="text-xl font-bold">친구 목록</h2>
            </div>
            <ul className="space-y-2">
                <li
                  className="py-2 flex items-center gap-2 border-b border-gray-300 shadow-sm cursor-pointer"
                  onClick={() => handleFriendClick('jaeseung')}
                >
                    <img src={userImg} alt="User" className="w-8 h-8 rounded-full" />
                    <span>jaeseung</span>
                    <span className="text-green-500 ml-auto">●</span>
                </li>
                <li
                  className="py-2 flex items-center gap-2 border-b border-gray-300 shadow-sm cursor-pointer"
                  onClick={() => handleFriendClick('junseo')}
                >
                    <img src={userImg} alt="User" className="w-8 h-8 rounded-full" />
                    <span>junseo</span>
                    <span className="text-gray-400 ml-auto">●</span>
                </li>
                <li
                  className="py-2 flex items-center gap-2 border-b border-gray-300 shadow-sm cursor-pointer"
                  onClick={() => handleFriendClick('daeyoung')}
                >
                    <img src={userImg} alt="User" className="w-8 h-8 rounded-full" />
                    <span>daeyoung</span>
                    <span className="text-gray-400 ml-auto">●</span>
                </li>
            </ul>
        </div>

        <div className="flex-1 flex flex-col mt-4 max-h-[600px] justify-center items-center">
          {selectedFriend ? (
            <>
              <h2 className="text-xl font-bold mb-4">{selectedFriend}</h2> {/* 클릭된 친구의 이름 표시 */}
              <div className="overflow-y-auto flex-1 mb-4 flex flex-col max-h-full">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg mb-2 max-w-xs break-words ${message.sender === userData.displayName ? 'bg-blue-500 text-white self-end' : 'bg-gray-100 text-gray-700 self-start'}`}
                    style={{ alignSelf: message.sender === userData.displayName ? 'flex-end' : 'flex-start' }}
                  >
                    {message.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="메시지를 입력하세요"
                  className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button className="bg-blue-500 text-white p-2 rounded-r" onClick={handleSendMessage}>
                  전송
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={logo} alt="Logo" style={{ width: '100px', height: '144px' }} />
              <h3 className="text-black text-l mt-8">접속중인 친구와 채팅을 시작해주세요!</h3>
            </>
          )}
        </div>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 ${leftSidebarOpen || rightSidebarOpen ? 'ml-64 mr-64' : ''}`}>
        {loading ? (
          <div className="flex flex-col items-center">
            <img src={logo} alt="Logo" style={{ width: '100px', height: '144px' }} />
            <div className="progressbar mb-1">
              <span className="loading"></span>
            </div>
            <h3 className="text-white text-2xl mt-8">로딩중입니다!</h3>
          </div>
        ) : (
          <h1 className="text-white text-5xl mb-4 fade-in">Metaverse</h1>
        )}
      </div>
    </div>
  );
}

export default UserMetaverse;
