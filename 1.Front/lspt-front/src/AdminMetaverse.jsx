import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/smalllogo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminMetaverse() {
  const [userData, setUserData] = useState({});
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('adminData'));
    if (storedData) {
      setUserData(storedData);
    }

    // Show the first toast message at the top-left corner
    const toastId1 = toast.info(
      <div style={{ fontSize: '16px', color: '#333' }}>
        키보드 <strong style={{ color: '#007BFF' }}>m</strong> 입력을 통해 <strong style={{ color: '#007BFF' }}>기능창</strong>을 활성화 할 수 있습니다!
        <button onClick={() => toast.dismiss(toastId1)} style={{ marginTop: '10px', display: 'block', backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          이해 했습니다!
        </button>
      </div>,
      {
        position: "top-left",
        autoClose: false,  // Do not close automatically
        hideProgressBar: true,  // Hide progress bar
        closeOnClick: false,  // Disable close on click (only close on button click)
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      }
    );

    // Show the second toast message at the top-right corner
    const toastId2 = toast.info(
      <div style={{ fontSize: '16px', color: '#333' }}>
        키보드 <strong style={{ color: '#007BFF' }}>c</strong> 입력을 통해 <br/><strong style={{ color: '#007BFF' }}>채팅창</strong>을 활성화 할 수 있습니다!
        <button onClick={() => toast.dismiss(toastId2)} style={{ marginTop: '10px', display: 'block', backgroundColor: '#007BFF', color: '#FFF', padding: '5px 10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          이해 했습니다!
        </button>
      </div>,
      {
        position: "top-right",
        autoClose: false,  // Do not close automatically
        hideProgressBar: true,  // Hide progress bar
        closeOnClick: false,  // Disable close on click (only close on button click)
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      }
    );

    // Clear all existing toasts when navigating to a different page
    return () => {
      toast.dismiss();
    };
  }, [navigate]);

  useEffect(() => {
    // Keyboard event listener
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

  const { nickname, memberType } = userData;

  return (
    <div className="min-h-screen flex relative">
      {/* Toast Container for displaying toast notifications */}
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
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="size-10 rounded-full object-cover"
              />

              <div>
                <p className="text-xs">
                  <strong className="block font-medium">{nickname || 'Nickname'}</strong>
                  <span> {memberType || 'Member Type'} </span>
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

      {/* Main Content */}
      <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 ${leftSidebarOpen || rightSidebarOpen ? 'ml-64 mr-64' : ''}`}>
        <h1 className="text-white text-5xl mb-4">Metaverse</h1>
      </div>
    </div>
  );
}

export default AdminMetaverse;
