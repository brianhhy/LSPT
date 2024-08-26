import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userImg from './assets/user.png';

import WcIcon from '@mui/icons-material/Wc';
import EcgHeartIcon from '@mui/icons-material/Favorite';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import WarningIcon from '@mui/icons-material/Warning';

function AdminMetaverse() {
  const [userData, setUserData] = useState({});
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);  // State to control alert visibility
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

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen((prev) => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen((prev) => !prev);
  };

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
              <li>
                <a
                  href="#"
                  className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  환자 정보
                </a>
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
                  <strong className="block font-medium">{userData.nickname || 'Nickname'}</strong>
                  <span> {userData.memberType || 'Member Type'} </span>
                </p>
              </div>
            </a>
          </div>
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

      {/* Alert Message */}
      {showAlert && (
        <div
          role="alert"
          className="fixed top-4 left-1/2 transform -translate-x-1/2 rounded-xl border border-s-4 border-red-500 bg-red-400 p-4 shadow-lg"
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
              onClick={() => setShowAlert(false)}  // Dismiss alert on click
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
      <div
        className={`flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center transition-all duration-300 ${leftSidebarOpen || rightSidebarOpen ? 'ml-64 mr-64' : ''}`}
      >
        {/* Styled Card */}
        <div className="max-w-sm bg-white shadow-xl rounded-xl border border-s-4 border-red-500 text-gray-900">
          <div className="rounded-t-lg h-32 overflow-hidden">
            <img className="object-cover object-top w-full" src={userImg} alt="Profile" />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img className="object-cover object-center h-32" src={userImg} alt="Profile" />
          </div>
          <div className="text-center mt-2">
            <h2 className="font-semibold">황호연</h2>
            <p className="text-gray-500">25살</p>
          </div>
          <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            <li className="flex flex-col items-center justify-around">
              <WcIcon className="text-blue-900" />
              <div>남</div>
            </li>
            <li className="flex flex-col items-center justify-between">
              <EcgHeartIcon className="text-blue-900" />
              <div className="text-red-500">130</div>
            </li>
            <li className="flex flex-col items-center justify-around">
              <DirectionsRunIcon className="text-blue-900" />
              <div>1,000보</div>
            </li>
          </ul>
          <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
              채팅하기
            </button>
          </div>
        </div>

        {/* Second Card */}
        <div className="max-w-sm bg-white shadow-xl rounded-lg text-gray-900">
          <div className="rounded-t-lg h-32 overflow-hidden">
            <img className="object-cover object-top w-full" src={userImg} alt="Profile" />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img className="object-cover object-center h-32" src={userImg} alt="Profile" />
          </div>
          <div className="text-center mt-2">
            <h2 className="font-semibold">윤제승</h2>
            <p className="text-gray-500">25살</p>
          </div>
          <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            <li className="flex flex-col items-center justify-around">
              <WcIcon className="text-blue-900" />
              <div>남</div>
            </li>
            <li className="flex flex-col items-center justify-between">
              <EcgHeartIcon className="text-blue-900" />
              <div className="text-gray-500">110</div>
            </li>
            <li className="flex flex-col items-center justify-around">
              <DirectionsRunIcon className="text-blue-900" />
              <div>1,200보</div>
            </li>
          </ul>
          <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
              채팅하기
            </button>
          </div>
        </div>

        {/* Additional Cards */}
        <div className="max-w-sm bg-white shadow-xl rounded-lg text-gray-900">
          <div className="rounded-t-lg h-32 overflow-hidden">
            <img className="object-cover object-top w-full" src={userImg} alt="Profile" />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img className="object-cover object-center h-32" src={userImg} alt="Profile" />
          </div>
          <div className="text-center mt-2">
            <h2 className="font-semibold">박준서</h2>
            <p className="text-gray-500">25살</p>
          </div>
          <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            <li className="flex flex-col items-center justify-around">
              <WcIcon className="text-blue-900" />
              <div>남</div>
            </li>
            <li className="flex flex-col items-center justify-between">
              <EcgHeartIcon className="text-blue-900" />
              <div className="text-black">120</div>
            </li>
            <li className="flex flex-col items-center justify-around">
              <DirectionsRunIcon className="text-blue-900" />
              <div>1,200보</div>
            </li>
          </ul>
          <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
              채팅하기
            </button>
          </div>
        </div>

        <div className="max-w-sm bg-white shadow-xl rounded-lg text-gray-900">
          <div className="rounded-t-lg h-32 overflow-hidden">
            <img className="object-cover object-top w-full" src={userImg} alt="Profile" />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img className="object-cover object-center h-32" src={userImg} alt="Profile" />
          </div>
          <div className="text-center mt-2">
            <h2 className="font-semibold">고대영</h2>
            <p className="text-gray-500">25살</p>
          </div>
          <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            <li className="flex flex-col items-center justify-around">
              <WcIcon className="text-blue-900" />
              <div>남</div>
            </li>
            <li className="flex flex-col items-center justify-between">
              <EcgHeartIcon className="text-blue-900" />
              <div className="text-gray-500">105</div>
            </li>
            <li className="flex flex-col items-center justify-around">
              <DirectionsRunIcon className="text-blue-900" />
              <div>1,200보</div>
            </li>
          </ul>
          <div className="p-4 border-t mx-8 mt-2">
            <button className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">
              채팅하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMetaverse;
