import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importing Material Icons
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ManageIcon from '@mui/icons-material/ManageAccounts';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import userImg from './assets/user.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function UserMetaverse() {
  // Predefined user data
  const userData = {
    nickname: 'hoyeon',
    memberType: '일반 회원',
    name: '홍길동',
    age: 25,
    weight: '70kg',
    gender: '남성',
    averageSteps: '8,000보',
  };

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [headerText, setHeaderText] = useState('사용자 신체정보');
  const navigate = useNavigate();

  useEffect(() => {
    const toastId1 = toast.info(
      <div style={{ fontSize: '16px', color: '#333' }}>
        키보드 <strong style={{ color: '#007BFF' }}>m</strong> 입력을 통해 <strong style={{ color: '#007BFF' }}>기능창</strong>을 활성화 할 수 있습니다!
        <button onClick={() => toast.dismiss(toastId1)} style={{ marginTop: '10px', display: 'block', backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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
        <button onClick={() => toast.dismiss(toastId2)} style={{ marginTop: '10px', display: 'block', backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
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

    return () => {
      toast.dismiss();
    };
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

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
  };

  const navigateToAiChat = (activeTab) => {
    navigate('/aichat', { state: { activeTab } }); // Pass the active tab state
  };

  const handleSearchClick = () => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
      setHeaderText(`${formattedDate} 신체정보`);
    }
  };

  const handleHealthInfoClick = () => {
    setSelectedDate(new Date()); // Reset to today's date
    setHeaderText('사용자 신체정보'); // Reset the header text
  };

  const handleLogout = () => {
    navigate('/login'); // Adjust the path to your login component
  };

  const { nickname, memberType, name, age, weight, gender, averageSteps } = userData;

  return (
    <div className="min-h-screen flex relative">
      <ToastContainer />

      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-between transition-transform duration-300 ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="mt-4" style={{ width: '70.5px', height: '101.5px' }} />
        </div>

        <div className="flex-1 px-4 py-6">
          <ul className="space-y-3">
            <li className="bg-gray-100 rounded-lg">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-gray-700"
                onClick={handleHealthInfoClick}
              >
                <HealthAndSafetyIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium">신체정보</span>
              </a>
            </li>

            {/* User Body Information */}
            <div className="mt-6">
              <h3 className="text-lg font-bold">{headerText}</h3>
              <p className="text-sm mt-2"><strong>닉네임 : </strong> {nickname}</p>
              <p className="text-sm"><strong>회원 유형 : </strong> {memberType}</p>
              <p className="text-sm"><strong>이름 : </strong> {name}</p>
              <p className="text-sm"><strong>나이 : </strong> {age}</p>
              <p className="text-sm"><strong>몸무게 : </strong> {weight}</p>
              <p className="text-sm"><strong>성별 : </strong> {gender}</p>
              <p className="text-sm"><strong>평균 걸음 : </strong> {averageSteps}</p>
            </div>

            <li className="hover:bg-gray-100 rounded-lg">
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2 text-gray-700"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
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
              <button
                onClick={() => navigateToAiChat('AI 상담 서비스')}
                className="group flex items-center justify-between px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                <div className="flex items-center gap-2">
                  <PsychologyIcon className="size-5 opacity-75" />
                  <span className="text-sm font-medium">AI 건강 상담</span>
                </div>
              </button>
            </li>

            <li className="hover:bg-gray-100 rounded-lg">
              <button
                onClick={() => navigateToAiChat('관리자 상담 서비스')}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                <ManageIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium"> 관리자 연결 </span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 p-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 bg-white hover:bg-gray-50">
            <img
              alt=""
              src={userImg}
              className="size-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs">
                <strong className="block font-medium">{nickname}</strong>
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
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-center transition-transform duration-300 ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div>
          <h2 className="text-2xl mb-4">채팅창 및 바로가기 사이드바</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 ${leftSidebarOpen || rightSidebarOpen ? 'ml-64 mr-64' : ''}`}>
        <h1 className="text-white text-5xl mb-4">Metaverse</h1>
      </div>
    </div>
  );
}

export default UserMetaverse;