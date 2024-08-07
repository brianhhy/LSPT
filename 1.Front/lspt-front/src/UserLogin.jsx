import './UserLogin.css';
import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useNavigate, Link } from 'react-router-dom';
import biglogoImg from './assets/biglogo.png';
import smalllogoImg from './assets/smalllogo.png';
import GoogleLogin from './GoogleLogin';
import patientImg from './assets/patient.png';
import adminImg from './assets/admin.png';
import fitbitWearImg from './assets/fitbitWear.jpg';

const patientFeatures = [
  '실시간 신체정보 확인',
  'AI를 통한 건강 상담 서비스',
  '메타버스를 활용한 실시간 소통',
];
const adminFeatures = [
  '환자 신체정보 실시간 확인',
  '환자와의 소통 및 건강 상담',
  '메타버스 관리',
];

const normalUserFeatures = [
  { name: '신체정보를 활용한 AI 건강 상담 서비스 ', description: '신체정보를 기반으로 건강 상담 서비스를 이용하세요', icon: CheckIcon },
  { name: '다른 사용자와 신체정보 공유', description: '자신의 신체정보를 다른 사용자와 공유하세요', icon: CheckIcon },
  { name: '신체정보를 활용한 전문가 건강 상담 서비스', description: '신체정보를 기반으로 전문가에게 건강 상담을 받으세요', icon: CheckIcon },
];

function UserLogin() {
  const [googleUserData, setGoogleUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSmallLogo, setShowSmallLogo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowLogo(false);
        setShowSmallLogo(true);
      }, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showLogo) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${fadeOut ? 'fade-out' : 'fade-in'}`}>
        <img src={biglogoImg} alt="Logo" style={{ width: '634px', height: '810px' }} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center fade-in ${showPatientInfo ? 'backdrop-blur' : ''}`}>
      {!userType ? (
        <SelectUserType setUserType={setUserType} setShowPatientInfo={setShowPatientInfo} />
      ) : userType === '일반 회원' && showPatientInfo ? (
        <PatientInfo setShowPatientInfo={setShowPatientInfo} setUserType={setUserType} />
      ) : (
        <Auth setGoogleUserData={setGoogleUserData} googleUserData={googleUserData} userType={userType} setUserType={setUserType} isLogin={isLogin} setIsLogin={setIsLogin} setShowPatientInfo={setShowPatientInfo} />
      )}
    </div>
  );
}

function SelectUserType({ setUserType, setShowPatientInfo }) {
  return (
    <>
      <div className="small-logo">
        <Link to="/login" onClick={() => window.location.reload()}>
          <img src={smalllogoImg} alt="Small Logo" className="smalllogo" />
        </Link>
      </div>
      <h1 className="text-white text-5xl mb-4 fade-in text-center">환영합니다! <br />회원 유형을 선택하세요</h1>
      <div className="flex flex-row space-x-4 fade-in">
        <div className="flex-1 min-w-[300px] min-h-[400px] bg-white rounded-2xl py-6 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-8 fade-in hover-border-parent" onClick={() => { setUserType('일반 회원'); setShowPatientInfo(true); }}>
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
        <div className="flex-1 min-w-[300px] min-h-[400px] bg-white rounded-2xl py-6 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-8 fade-in hover-border-parent" onClick={() => setUserType('관리자 회원')}>
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
  );
}

function PatientInfo({ setShowPatientInfo, setUserType }) {
  return (
    <div className="relative overflow-hidden bg-white py-24 sm:py-32 fade-in">
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => { setShowPatientInfo(false); setUserType(null); }}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">메타버스 입장 전</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Fitbit 계정 연동을 진행합니다.</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                신체정보 수집을 위해 Fitbit 계정과 할머니를 부탁해 서비스 계정을 연동합니다. 수집되는 신체정보를 바탕으로 메타버스 내에 다양한 기능을 이용할 수 있습니다!
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {normalUserFeatures.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                      {feature.name}
                    </dt>
                    <dd className="inline"><br/>{feature.description}</dd>
                    
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex items-center justify-center gap-x-6 lg:justify-start">
                      <button
                        className="rounded-md px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        style={{ background: '-webkit-linear-gradient(left, #7F7FD5, #86A8E7, #91EAE4)' }}
                      >
                        Fitbit 연동하기
                      </button>
                    </div>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src={fitbitWearImg}
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}

function Auth({ setGoogleUserData, googleUserData, userType, setUserType, isLogin, setIsLogin, setShowPatientInfo }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="wrapper fade-in relative">
      <div className="title-text">
        <div className={`title ${isLogin ? 'login' : 'signup'}`}>
          {isLogin ? '로그인' : '회원가입'}
        </div>
      </div>
      <div className="form-container">
        <div className="slide-controls">
          <input type="radio" name="slide" id="login" checked={isLogin} readOnly />
          <input type="radio" name="slide" id="signup" checked={!isLogin} readOnly />
          <label htmlFor="login" className="slide login" onClick={() => setIsLogin(true)}>로그인</label>
          <label htmlFor="signup" className="slide signup" onClick={() => setIsLogin(false)}>회원가입</label>
          <div className="slider-tab" style={{ left: isLogin ? '0%' : '50%' }}></div>
        </div>
        <div className="form-inner">
          <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} setGoogleUserData={setGoogleUserData} googleUserData={googleUserData} userType={userType} setUserType={setUserType} setShowPatientInfo={setShowPatientInfo} />
        </div>
      </div>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        onClick={() => { setShowPatientInfo(false); setUserType(null); }}
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

function LoginForm({ isLogin, setIsLogin, setGoogleUserData, googleUserData, setUserType, userType, setShowPatientInfo }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: googleUserData ? googleUserData.name : '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    memberType: userType || '',
  });
  const [googleLoginStatus, setGoogleLoginStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (googleUserData) {
      setFormData((prevData) => ({
        ...prevData,
        nickname: googleUserData.name,
        email: googleUserData.email,
        memberType: userType,
      }));
    }
  }, [googleUserData, userType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      if (storedData && storedData.email === formData.email && storedData.password === formData.password) {
        navigate('/metaverse');
      } else {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
      localStorage.setItem('userData', JSON.stringify(formData));
      navigate('/metaverse');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-8 rounded-lg shadow-md text-center ${isLogin ? '' : 'signup'}`}>
      <h2 className="text-2xl mb-4">{isLogin ? '로그인' : '회원가입'}</h2>
      {!isLogin && (
        <div className="field">
          <input type="text" name="nickname" placeholder="닉네임" value={formData.nickname} onChange={handleInputChange} required />
        </div>
      )}
      <div className="field">
        <input type="email" name="email" placeholder="이메일" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div className="field">
        <input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleInputChange} required />
      </div>
      {!isLogin && (
        <div className="field">
          <input type="password" name="confirmPassword" placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleInputChange} required />
        </div>
      )}
      <div className="field btn">
        <div className="btn-layer"></div>
        <input type="submit" value={isLogin ? '로그인' : '회원가입'} />
      </div>
      {googleLoginStatus ? (
        <div className="w-full h-10 bg-green-600 text-white py-2 rounded-md flex items-center justify-center mt-4">
          <CheckIcon aria-hidden="true" className="h-5 w-5 flex-none bg-white-10" /> 구글 로그인에 성공 했습니다
        </div>
      ) : (
        <GoogleLogin setGoogleUserData={setGoogleUserData} setView={setIsLogin} setGoogleLoginStatus={setGoogleLoginStatus} userType={userType} setShowForm={() => setIsLogin(false)} />
      )}
    </form>
  );
}

export default UserLogin;
