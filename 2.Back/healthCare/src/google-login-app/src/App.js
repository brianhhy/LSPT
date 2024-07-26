import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);
  const google = <FontAwesomeIcon icon={faGoogle} size="10x" />;
  const oAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=291815217838-rs2shve1q824p135226rob4nm0pt5o95.apps.googleusercontent.com&response_type=token&redirect_uri=http://localhost:3000&scope=https://www.googleapis.com/auth/userinfo.email`;
  const fitbitOAuthURL = `https://localhost:8443/authorize`;

  const oAuthHandler = () => {
    window.location.assign(oAuthURL);
  };

  const fitbitOAuthHandler = () => {
    window.location.assign(fitbitOAuthURL);
  };


  useEffect(() => {
    const fetchData = async () => {
      const url = new URL(window.location.href);
      const hash = url.hash;
      if (hash) {
        const accessToken = hash.split("=")[1].split("&")[0];
        try {
          const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + accessToken, {
            headers: {
              authorization: `Bearer ${accessToken}`,
              accept: 'application/json',
            },
          });
          console.log(response.data);
          setData(response.data);
        } catch (error) {
          console.log('oAuth token expired', error);
        }
      }
      // 추가: Spring Boot 서버에서 Fitbit 사용자 데이터 가져오기
            const query = new URLSearchParams(window.location.search);
            const fitbitToken = query.get('fitbitToken');
            if (fitbitToken) {
              try {
                const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json', {
                  headers: {
                    authorization: `Bearer ${fitbitToken}`,
                    accept: 'application/json',
                  },
                });
                console.log(response.data);
                setData(response.data);
              } catch (error) {
                console.log('Fitbit OAuth token expired or invalid', error);
              }
            }
    };

    fetchData();
  }, []);

  return (
    <div>
      <button id="oAuthBtn" onClick={oAuthHandler}>
        {google}
        <div id="comment">구글 OAuth</div>
      </button>
      <button id="fitbitOAuthBtn" onClick={fitbitOAuthHandler}>
        Fitbit OAuth
      </button>
      {data && (
        <div>
          <h3>로그인 성공</h3>
          <p>이름: {data.name}</p>
          <p>이메일: {data.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
