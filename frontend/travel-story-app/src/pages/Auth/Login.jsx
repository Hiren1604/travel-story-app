import React, { useState } from 'react'
import PasswordInput from '../../components/input/PasswordInput'
import { useNavigate } from "react-router-dom"
import { validateEmail } from '../../utils/helper';

const Login = () => {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);


  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if(!validateEmail(email)) {
      setError("Please enter a valid amail address.");
      return;
    }

    if(!password) {
      setError("Please enter the password.");
      return;
    }
    setError("");

    //Api Call
    
  }
  return (
    <div className='overflow-hidden bg-cyan-50 h-screen relative'>
      <div className='container flex justify-center items-center h-screen px-20 mx-auto'>
        <div className='w-1/3 h-[80vh] flex flex-col justify-end bg-loginbg-img bg-cover bg-center p-10 z-50 rounded-xl'>
          <h4 className='text-white font-bold text-4xl mb-3'>Capture your <br />Moments</h4>
          <p className='text-cyan-50 text-lg'>Save all your exciting stories and memories</p>
        </div>
        <div className='p-16 w-1/3 h-[70vh] bg-white rounded-r-lg relative shadow-lg shadow-cyan-200/20 flex flex-col items-start justify-center'>
          <form onSubmit={handleLogin} className='w-full'>
            <h4 className='text-4xl font-bold mb-7'>Login</h4>
            <input type="text" placeholder='Enter your Email' className='input-email' value={email} onChange={({target})=>{setEmail(target.value)}}/>
            <PasswordInput value={password} onChange={({target})=>{setPassword(target.value)}}/>
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <div>
              <button className='btn-primary' type='submit'>LOGIN</button>
              <p className='text-sm text-slate-500 text-center'>OR</p>
              <button type='button' className='btn-light' onClick={() => navigate("/signup")}>CREATE ACCOUNT</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
