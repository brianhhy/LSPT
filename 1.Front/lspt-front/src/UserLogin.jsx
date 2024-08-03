import './UserLogin.css';
import { useState, useEffect } from 'react';
import { CheckIcon, ArrowUturnLeftIcon, HomeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';
import patientImg from './assets/patient.png';
import adminImg from './assets/admin.png';

const patientFeatures = [
  '실시간 신체정보 확인',
  'AI를 통한 건강 상담 서비스',
  '메타버스를 활용한 실시간 소통'
];
const adminFeatures = [
  '환자 신체정보 실시간 확인',
  '환자와의 소통 및 건강 상담',
  '메타버스 관리',
];

function UserLogin() {
  const [googleUserData, setGoogleUserData] = useState(null);
  const [userType, setUserType] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-fc00ff to-00dbde fade-in">
      <Auth setGoogleUserData={setGoogleUserData} googleUserData={googleUserData} userType={userType} setUserType={setUserType} />
    </div>
  );
}

function Auth({ setGoogleUserData, googleUserData, userType, setUserType }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-fc00ff to-00dbde fade-in">
      {view === 'login' ? (
        <LoginForm onLogin={() => setIsLoggedIn(true)} onSwitchView={() => setView('createAccount')} setGoogleUserData={setGoogleUserData} setView={setView} googleUserData={googleUserData} setUserType={setUserType} userType={userType} />
      ) : (
        <CreateAccount userType={userType} setUserType={setUserType} setView={setView} googleUserData={googleUserData} setViewToLogin={() => setView('login')} setGoogleUserData={setGoogleUserData} />
      )}
    </div>
  );
}

function LoginForm({ onLogin, onSwitchView, setGoogleUserData, setView, googleUserData, setUserType, userType }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [googleLoginStatus, setGoogleLoginStatus] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.email === formData.email && storedData.password === formData.password) {
      onLogin();
      navigate('/metaverse');
    } else {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md text-center">
      <h2 className="text-2xl mb-4">로그인</h2>
      <div className="mb-4">
        <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      </div>
      <div className="mb-4">
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 mb-4">로그인</button>
      <button type="button" onClick={onSwitchView} className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-500 mb-4">회원가입</button>
      {googleLoginStatus ? (
        <div className="w-full h-10 bg-green-600 text-white py-2 rounded-md flex items-center justify-center">
          구글 로그인에 성공 했습니다
        </div>
      ) : (
        <GoogleLogin setGoogleUserData={setGoogleUserData} setView={setView} setGoogleLoginStatus={setGoogleLoginStatus} userType={userType} setShowForm={() => setView('createAccount')} />
      )}
    </form>
  );
}

function CreateAccount({ userType, setUserType, setView, googleUserData, setViewToLogin, setGoogleUserData }) {
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(googleUserData !== null);
  const [formData, setFormData] = useState({
    nickname: googleUserData ? googleUserData.name : '',
    email: googleUserData ? googleUserData.email : '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    memberType: userType || ''
  });
  const [googleLoginStatus, setGoogleLoginStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (storedData.email === formData.email && storedData.password === formData.password) {
        navigate('/metaverse');
      } else {
        setViewToLogin();
        navigate('/');
      }
    }
  }, [data, navigate, setViewToLogin, formData]);

  useEffect(() => {
    if (googleUserData) {
      setFormData((prevData) => ({
        ...prevData,
        nickname: googleUserData.name,
        email: googleUserData.email,
        memberType: userType
      }));
      setShowForm(true);
    }
  }, [googleUserData, userType]);

  const handleUserType = (type) => {
    setUserType(type);
    setFormData((prevData) => ({ ...prevData, memberType: type }));
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    localStorage.setItem('userData', JSON.stringify(formData));
    setData(formData); 
  };

  const handleBack = () => {
    setShowForm(false);
    setUserType(null);
  };

  return (
    <>
      {!showForm ? (
        <>
          <button onClick={() => setView('login')} className="absolute top-4 left-4 text-white p-2 flex items-center">
            <HomeIcon className="h-6 w-6 text-white" />
          </button>
          <h1 className="text-white text-5xl mb-4 fade-in">회원 유형을 선택하세요</h1>
          <div className="flex flex-row space-x-4 fade-in">
            <div className="flex-1 min-w-[300px] min-h-[400px] rounded-2xl bg-gray-50 py-6 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-8 fade-in hover-border-parent" onClick={() => handleUserType('일반 회원')}>
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-bold text-gray-600">일반 회원으로 시작</p>
                <p className="mt-1 text-xs leading-5 text-gray-600">건강 관리를 시작하세요</p>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  <img src={patientImg} alt="환자" className="w-24 h-24 object-cover" />
                </div>
                <button className="mt-6 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover-border">
                  시작하기
                </button>
                <p className="mt-4 text-xs leading-5 text-gray-600">
                  제공하는 서비스
                </p>
                <ul className="mt-2">
                  {patientFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-x-3">
                      <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                      <p className="text-xs font-semibold text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex-1 min-w-[300px] min-h-[400px] rounded-2xl bg-gray-50 py-6 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-8 fade-in hover-border-parent" onClick={() => handleUserType('관리자 회원')}>
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-bold text-gray-600">관리자 회원으로 시작</p>
                <p className="mt-1 text-xs leading-5 text-gray-600">환자들을 관리하세요</p>
                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                  <img src={adminImg} alt="관리자" className="w-24 h-24 object-cover" />
                </div>
                <button className="mt-6 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover-border">
                  시작하기
                </button>
                <p className="mt-4 text-xs leading-5 text-gray-600">
                  제공하는 서비스
                </p>
                <ul className="mt-2">
                  {adminFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-x-3">
                      <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                      <p className="text-xs font-semibold text-gray-500">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="relative mt-8 bg-white p-8 rounded-lg shadow-md text-center fade-in">
          <button onClick={handleBack} className="absolute top-6 left-4 text-gray-200 p-2 flex items-center">
            <ArrowUturnLeftIcon className="h-5 w-5 text-gray-700 mr-1" />
          </button>
          <h2 className="text-2xl mb-4">회원가입</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <input type="text" name="memberType" placeholder="회원 유형" value={formData.memberType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled />
            </div>
            <div>
              <input type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <input type="number" name="age" placeholder="나이" value={formData.age} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <input type="number" name="height" placeholder="키 (cm)" value={formData.height} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <input type="number" name="weight" placeholder="몸무게 (kg)" value={formData.weight} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 mt-4">회원가입</button>
          {googleLoginStatus ? (
            <div className="w-full h-10 bg-green-600 text-white py-2 rounded-md flex items-center justify-center mt-4">
              <CheckIcon aria-hidden="true" className="h-5 w-5 flex-none bg-white-10" />구글 로그인에 성공 했습니다
            </div>
          ) : (
            <GoogleLogin setGoogleUserData={setGoogleUserData} setView={setView} setGoogleLoginStatus={setGoogleLoginStatus} userType={formData.memberType} setShowForm={setShowForm} />
          )}
        </form>
      )}
    </>
  );
}

export default UserLogin;
