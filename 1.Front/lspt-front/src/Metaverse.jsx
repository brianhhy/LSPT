import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Metaverse() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://localhost:8443/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 세션 쿠키를 포함하여 요청을 보냅니다.
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user); // JSON 구조에 맞게 user 객체를 설정
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-fc00ff to-00dbde fade-in">
      <div className="fixed top-0 left-0 h-full w-64 bg-white p-8 shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-2xl mb-4">User Information</h2>
          <p className="text-xl mb-2">Nickname: {userData.displayName}</p>
          <p className="text-xl mb-2">Age: {userData.age}</p>
          <p className="text-xl mb-2">Height: {userData.height} cm</p>
          <p className="text-xl mb-2">Weight: {userData.weight} kg</p>
          <p className="text-xl mb-2">Gender: {userData.gender}</p>
          <p className="text-xl mb-2">Average Daily Steps: {userData.averageDailySteps}</p>
        </div>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
      <div className="ml-64 flex-1 flex flex-col items-center justify-center">
        <h1 className="text-white text-5xl mb-4">Metaverse</h1>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl mb-4">Welcome to the Metaverse</h2>
          {/* 다른 콘텐츠를 이곳에 추가할 수 있습니다. */}
        </div>
      </div>
    </div>
  );
}

export default Metaverse;
