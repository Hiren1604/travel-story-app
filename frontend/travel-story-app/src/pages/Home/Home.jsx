import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if(response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    }
    catch(err) {
      if(err.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }

  useEffect(()=> {
    getUserInfo();
    return ()=> {}
  }, []);
  return (
    <div>
      <Navbar userInfo = {userInfo}/>
    </div>
  )
}

export default Home
