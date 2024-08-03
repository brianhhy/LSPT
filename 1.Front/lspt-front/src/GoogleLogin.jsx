import React, { useEffect } from 'react';
import axios from 'axios';
import googleImg from './assets/google.svg';
import { useNavigate } from 'react-router-dom';

function GoogleLogin({ setGoogleUserData, setView, setGoogleLoginStatus, userType, setShowForm }) {
  const navigate = useNavigate();
  const oAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=291815217838-rs2shve1q824p135226rob4nm0pt5o95.apps.googleusercontent.com&response_type=token&redirect_uri=http://localhost:3000/login&scope=https://www.googleapis.com/auth/userinfo.email profile`;

  const oAuthHandler = () => {
    window.location.assign(oAuthURL);
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = new URL(window.location.href);
      const hash = url.hash;
      if (hash) {
        const accessToken = new URLSearchParams(hash.slice(1)).get('access_token');
        if (accessToken) {
          try {
            const response = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
              headers: {
                authorization: `Bearer ${accessToken}`,
                accept: 'application/json',
              },
            });
            setGoogleUserData(response.data);
            setGoogleLoginStatus(true);
            setShowForm(true);
            setView('createAccount');
          } catch (error) {
            console.log('OAuth token expired', error);
          }
        }
      }
    };

    fetchData();
  }, [setGoogleUserData, setView, setGoogleLoginStatus, navigate, userType, setShowForm]);

  return (
    <button
      type="button"
      onClick={oAuthHandler}
      style={{
        width: '100%',
        height: '40px',
        background: `url(${googleImg}) no-repeat center center`,
        backgroundSize: 'contain',
        border: 'none',
        cursor: 'pointer',
        marginTop: '16px',
      }}
    />
  );
}

export default GoogleLogin;
