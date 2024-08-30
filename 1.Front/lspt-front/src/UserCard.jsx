import React from 'react';
import WcIcon from '@mui/icons-material/Wc';
import EcgHeartIcon from '@mui/icons-material/Favorite';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import userImg from './assets/user.png';

function UserCard({ name, age, gender, heartRate, steps, onChatClick }) {
  return (
    <div className="max-w-sm bg-white shadow-xl rounded-lg text-gray-900">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img className="object-cover object-top w-full" src={userImg} alt="Profile" />
      </div>
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img className="object-cover object-center h-32" src={userImg} alt="Profile" />
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold">{name}</h2>
        <p className="text-gray-500">{age}살</p>
      </div>
      <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
        <li className="flex flex-col items-center justify-around">
          <WcIcon className="text-blue-900" />
          <div>{gender}</div>
        </li>
        <li className="flex flex-col items-center justify-between">
          <EcgHeartIcon className="text-blue-900" />
          <div className={heartRate > 120 ? 'text-red-500' : 'text-gray-500'}>{heartRate}</div>
        </li>
        <li className="flex flex-col items-center justify-around">
          <DirectionsRunIcon className="text-blue-900" />
          <div>{steps}보</div>
        </li>
      </ul>
      <div className="p-4 border-t mx-8 mt-2">
        <button
          className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
          onClick={() => onChatClick(name)} // 클릭 시 부모 컴포넌트로 사용자 이름 전달
        >
          채팅하기
        </button>
      </div>
    </div>
  );
}

export default UserCard;
