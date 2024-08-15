import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/solid';

function UserMetaverse() {
  const [userData, setUserData] = useState({});
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false); // Default left sidebar closed
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false); // Default right sidebar closed
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('adminData'));
    if (storedData) {
      setUserData(storedData);
    }
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(prev => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(prev => !prev);
  };

  const { nickname, memberType, fitbitIntegration, age, height, weight } = userData;

  return (
    <div className="min-h-screen flex relative">
      {/* Left Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-center transition-transform duration-300 ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={toggleLeftSidebar}
        >
          {/* Add icon or text for closing */}
        </button>
        <div>
          <h2 className="text-2xl mb-4">User Information</h2>
          <p className="text-xl mb-2">{nickname}</p>
          <p className="text-xl mb-2">{memberType}</p>
          {fitbitIntegration && (
            <>
              <p className="text-xl mb-2">{age}</p>
              <p className="text-xl mb-2">{height} cm</p>
              <p className="text-xl mb-2">{weight} kg</p>
            </>
          )}
        </div>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500 mt-4"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-center transition-transform duration-300 ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          onClick={toggleRightSidebar}
        >
          {/* Add icon or text for closing */}
        </button>
        <div>
          {/* Add content for the right sidebar here */}
          <h2 className="text-2xl mb-4">채팅창 및 바로가기 사이드바</h2>
          {/* More content */}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 ${leftSidebarOpen || rightSidebarOpen ? 'ml-64 mr-64' : ''}`}>
        <button
          className={`fixed top-4 left-4 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 ${leftSidebarOpen ? 'block' : 'block'}`}
          onClick={toggleLeftSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <button
          className={`fixed top-4 right-4 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 ${rightSidebarOpen ? 'block' : 'block'}`}
          onClick={toggleRightSidebar}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-white text-5xl mb-4">Metaverse</h1>
        메타버스
      </div>
    </div>
  );
}

export default UserMetaverse;
