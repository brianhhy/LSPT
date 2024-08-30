import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserMetaverse.css';
import Metaverse from './Metaverse';
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
  const [loading, setLoading] = useState(true); // Loading state
  const [showHealthInfo, setShowHealthInfo] = useState(true); // 신체정보 표시 여부 상태
  /*----------------------↓대영수정---------------------------*/
  const [activityData, setActivityData] = useState({
    caloriesOut: 0,
    totalDistance: 0,
    steps: 0,
  }); // 활동 데이터를 저장할 상태 추가
  /*----------------------↑대영수정---------------------------*/

  const navigate = useNavigate();

  // 새로운 상태 추가
  const [selectedFriend, setSelectedFriend] = useState('');

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [ws, setWs] = useState(null);

  const messagesEndRef = useRef(null);
  const [users, setUsers] = useState([]); // 추가된 상태: 현재 웹소켓에 접속한 사용자 목록

  useEffect(() => {
    const websocket = new WebSocket('wss://localhost:8443/chat'); // WebSocket 주소 수정
    setWs(websocket);

    websocket.onopen = () => {
      console.log("WebSocket is open now.");
    };

    websocket.onmessage = (event) => {
      let receivedMessage;
      try {
        receivedMessage = JSON.parse(event.data);
      } catch (error) {
        receivedMessage = { sender: 'System', text: event.data };
      }

      if (receivedMessage.type === 'userList') {
        setUsers(receivedMessage.users); // 사용자 목록 업데이트
      } else {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket is closed now.");
    };

    websocket.onerror = (event) => {
      console.log("WebSocket error observed:", event);
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
        sender: userData.displayName, // 수정: sender 필드 추가
        message: inputMessage,
        recipient: selectedFriend // 1대1 채팅을 위해 수신자 설정
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

  /*----------------------------↓대영수정--------------------------------------------*/
  const handleSearchClick = async () => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
      setHeaderText(`${formattedDate} 활동 정보`);

      const formattedDateForAPI = selectedDate.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
      const url = `https://localhost:8443/api/activities?date=${formattedDateForAPI}`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const caloriesOut = data.summary.caloriesOut;
          const steps = data.summary.steps;
          const totalDistance = data.summary.distances.find((d) => d.activity === 'total').distance;

          setActivityData({
            caloriesOut,
            totalDistance,
            steps,
          });
          setShowHealthInfo(false); // 활동 정보 표시로 전환
        } else {
          console.error('활동 데이터를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('API 요청 중 에러 발생:', error);
      }
    }
  };
   /*----------------------------↑대영수정--------------------------------------------*/

  const handleHealthInfoClick = () => {
    setSelectedDate(new Date()); // Reset to today's date
    setHeaderText('사용자 신체정보'); // Reset the header text
    setShowHealthInfo(true); // 신체정보로 전환
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
              {showHealthInfo ? (
                <>
                  <p className="text-sm mt-2"><strong>닉네임 : </strong> {displayName}</p>
                  <p className="text-sm"><strong>회원 유형 : 일반 회원 </strong> {memberType}</p>
                  <p className="text-sm"><strong>나이 : </strong> {age}</p>
                  <p className="text-sm"><strong>몸무게 : </strong> {weight}</p>
                  <p className="text-sm"><strong>성별 : </strong> {gender}</p>
                  <p className="text-sm"><strong>평균 걸음 : </strong> {averageDailySteps}</p>
                </>
              ) : (
                <>
                  <p className="text-sm"><strong>총 소모 칼로리 : </strong> {activityData.caloriesOut} kcal</p>
                  <p className="text-sm"><strong>총 거리 : </strong> {activityData.totalDistance} km</p>
                  <p className="text-sm"><strong>걸음 수 : </strong> {activityData.steps} 걸음</p>
                </>
              )}
            </div>
            {/* ----------------------------↑대영 수정--------------------------------------*/}

            <li className="hover:bg-gray-100 rounded-lg">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-gray-700"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <CalendarIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium">지난 활동정보</span>
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
                  <button
                    onClick={handleSearchClick}
                    className="absolute right-0 p-2 bg-blue-500 text-white rounded-r whitespace-nowrap"
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                  >
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
            {users.map((user, index) => (
              <li
                key={index}
                className="py-2 flex items-center gap-2 border-b border-gray-300 shadow-sm cursor-pointer"
                onClick={() => handleFriendClick(user)}
              >
                <img src={userImg} alt="User" className="w-8 h-8 rounded-full" />
                <span>{user}</span>
                <span className="text-green-500 ml-auto">●</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col mt-4 max-h-[600px]">
          {selectedFriend ? (
            <>
              <div className="flex justify-center mb-4">
                <h2 className="text-xl font-bold">{selectedFriend}</h2>
              </div>

              <div className="overflow-y-auto flex-1 mb-4 flex flex-col max-h-full">
              {messages.map((message, index) => (
                  <div
                  key={index}
                  className={`p-2 rounded-lg mb-2 max-w-xs break-words ${
                    message.sender === userData.displayName
                      ? 'bg-blue-500 text-white self-end' // 내가 보낸 메시지
                      : 'bg-gray-100 text-gray-700 self-start' // 다른 사용자가 보낸 메시지
                  }`}
                  style={{
                    alignSelf: message.sender === userData.displayName ? 'flex-end' : 'flex-start',
                  }}
                  >
                    {message.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex w-full">
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
              <div className="flex justify-center">
                <img src={logo} alt="Logo" style={{ width: '100px', height: '144px' }} />
              </div>
              <h3 className="text-black text-l mt-8 text-center">접속중인 친구와 채팅을 시작해주세요!</h3>
            </>
          )}
        </div>

      </div>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${leftSidebarOpen ? 'pl-64' : ''} ${rightSidebarOpen ? 'pr-96' : ''}`}>
        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <img src={logo} alt="Logo" style={{ width: '100px', height: '144px' }} />
            <div className="progressbar mb-1">
              <span className="loading"></span>
            </div>
            <h3 className="text-white text-2xl mt-8">로딩중입니다!</h3>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center w-full h-full">
            <Metaverse />
          </div>
        )}
      </div>





    </div>
  );
}

export default UserMetaverse;