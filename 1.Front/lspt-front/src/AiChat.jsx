import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ManageIcon from '@mui/icons-material/ManageAccounts';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import LogoutIcon from '@mui/icons-material/Logout';
import userImg from './assets/user.png';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AiChatBox from './AiChatBox';
import AdminChatBox from './AdminChatBox';


function AiChat() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('AI 상담 서비스'); // Default tab
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [headerText, setHeaderText] = useState('사용자 신체정보');

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab); // Set tab based on the state passed
    }
  }, [location.state]);

  const userData = {
    nickname: 'hoyeon',
    memberType: '일반 회원',
    name: '홍길동',
    age: 25,
    weight: '70kg',
    gender: '남성',
    averageSteps: '8,000보',
  };

  const handleHealthInfoClick = () => {
    setSelectedDate(new Date()); // Reset to today's date
    setHeaderText('사용자 신체정보'); // Reset the header text
  };

  const handleSearchClick = () => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`;
      setHeaderText(`${formattedDate} 신체정보`);
    }
  };

  // 클립보드에 사용자 정보를 복사하는 함수
  const copyToClipboard = () => {
    const userInfo = `
      닉네임: ${userData.nickname}
      회원 유형: ${userData.memberType}
      이름: ${userData.name}
      나이: ${userData.age}
      몸무게: ${userData.weight}
      성별: ${userData.gender}
      평균 걸음: ${userData.averageSteps}
    `;
    navigator.clipboard.writeText(userInfo)
      .then(() => {
        alert('사용자 정보가 클립보드에 복사되었습니다.');
      })
      .catch((err) => {
        console.error('클립보드 복사에 실패했습니다:', err);
      });
  };

  const { nickname, memberType, name, age, weight, gender, averageSteps } = userData;

  return (
    <div className="min-h-screen flex relative">
      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-between transition-transform duration-300`}
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
            <div 
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
              onClick={copyToClipboard} // 클릭하면 복사되는 기능 추가
              style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }} // 텍스트가 입력창을 벗어나지 않도록 조정
            >
              <h3 className="text-lg font-bold mb-2">사용자 정보</h3>
              <p className="text-sm"><strong>닉네임:</strong> {nickname}</p>
              <p className="text-sm"><strong>회원 유형:</strong> {memberType}</p>
              <p className="text-sm"><strong>이름:</strong> {name}</p>
              <p className="text-sm"><strong>나이:</strong> {age}</p>
              <p className="text-sm"><strong>몸무게:</strong> {weight}</p>
              <p className="text-sm"><strong>성별:</strong> {gender}</p>
              <p className="text-sm"><strong>평균 걸음:</strong> {averageSteps}</p>
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
                onClick={() => setActiveTab('AI 상담 서비스')}
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
                onClick={() => setActiveTab('관리자 상담 서비스')}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700"
              >
                <ManageIcon className="size-5 opacity-75" />
                <span className="text-sm font-medium"> 관리자 연결 </span>
              </button>
            </li>
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-10">
        {/* Tabs Component */}
        <div className="max-w-max">
          <div className="bg-transparent z-10 shadow-md">
            <div className="sm:hidden">
              <label htmlFor="Tab" className="sr-only">Tab</label>

              <select
                id="Tab"
                className="w-full rounded-md border-gray-200"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option>AI 상담 서비스</option>
                <option>관리자 상담 서비스</option>
              </select>
            </div>

            <div className="hidden sm:block">
              <nav className="flex gap-6 p-4 justify-center" aria-label="Tabs">
                <a
                  href="#"
                  className={`shrink-0 rounded-lg p-2 text-sm font-medium ${
                    activeTab === 'AI 상담 서비스'
                      ? 'bg-sky-100 text-sky-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('AI 상담 서비스')}
                >
                  AI 상담 서비스
                </a>

                <a
                  href="#"
                  className={`shrink-0 rounded-lg p-2 text-sm font-medium ${
                    activeTab === '관리자 상담 서비스'
                      ? 'bg-sky-100 text-sky-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('관리자 상담 서비스')}
                >
                  관리자 상담 서비스
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Centered ChatBox */}
        <div className="flex-1 flex items-center justify-center w-full">
          {activeTab === 'AI 상담 서비스' && (
            <AiChatBox />
          )}
          {activeTab === '관리자 상담 서비스' && (
            <AdminChatBox /> 
          )}
        </div>
      </div>
    </div>
  );
}

export default AiChat;
