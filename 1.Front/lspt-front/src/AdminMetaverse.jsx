import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WarningIcon from '@mui/icons-material/Warning';
import UserCard from './UserCard';
import AdminChatBox from './ToAdminFromUser';
import userImg from './assets/user.png';

function AdminMetaverse() {
  const [userData, setUserData] = useState({});
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false); 
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatUser, setChatUser] = useState('');
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('adminData'));
    if (storedData) {
      setUserData(storedData);
    }

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
    // 2초 뒤에 showAlert를 true로 설정하여 알림 메시지 표시
    const timer = setTimeout(() => {
      setShowAlert(true);
    }, 2000);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머를 정리
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'm') {
        toggleLeftSidebar();
      } else if (e.key === 'c') {
        toggleChatBox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const toggleChatBox = () => {
    setShowChatBox((prev) => !prev);
  };

  const handleChatClick = (name, index) => {
    setChatUser(name);
    setShowChatBox(true);
    setSelectedUserIndex(index);
  };

  const users = [
    { name: "황호연", age: 25, gender: "남", heartRate: 130, steps: 1000 },
    { name: "윤제승", age: 25, gender: "남", heartRate: 110, steps: 1200 },
    { name: "박준서", age: 25, gender: "남", heartRate: 120, steps: 1200 },
    { name: "고대영", age: 25, gender: "남", heartRate: 105, steps: 1200 }
  ];

  return (
    <div className="min-h-screen flex relative">
      <ToastContainer />

      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-center transition-transform duration-300 ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-screen flex-col justify-between bg-white">
          <div className="flex flex-col items-center justify-center flex-grow">
            <img src={logo} alt="Logo" style={{ width: '70.5px', height: '101.5px' }} />
          </div>
          <div className="px-4 py-6">
            <ul className="mt-6 space-y-1">
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
                  <strong className="block font-medium">{userData.nickname || 'Nickname'}</strong>
                  <span> {userData.memberType || 'Member Type'} </span>
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {showAlert && (
        <div
          role="alert"
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 rounded-xl border border-s-4 border-red-500 bg-red-400 p-4 shadow-lg mb-8 transition-opacity duration-500 ${showAlert ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-start gap-4">
            <span className="text-white">
              <WarningIcon fontSize="large" />
            </span>

            <div className="flex-1">
              <strong className="block font-medium text-white"> 경고 </strong>

              <p className="mt-1 text-sm text-white">
                황호연 환자의 평균 심박수가 130을 넘었습니다.
              </p>
            </div>

            <button
              className="text-white transition hover:text-gray-200"
              onClick={() => setShowAlert(false)}
            >
              <span className="sr-only">Dismiss popup</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-8">
        {/* User Cards */}
        {users.map((user, index) => (
          <UserCard
            key={index}
            name={user.name}
            age={user.age}
            gender={user.gender}
            heartRate={user.heartRate}
            steps={user.steps}
            onChatClick={() => handleChatClick(user.name, index)}
          />
        ))}
      </div>

      {/* AdminChatBox */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 lg:w-1/4 bg-white shadow-lg p-4 transition-transform duration-300 transform ${
          showChatBox ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {showChatBox && <AdminChatBox userName={chatUser} />}
      </div>
    </div>
  );
}

export default AdminMetaverse;
