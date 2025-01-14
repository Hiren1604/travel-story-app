import React from 'react'

const Login = () => {
  return (
    <div className='overflow-hidden bg-cyan-50 h-screen relative'>
      <div className='container flex justify-center items-center h-screen px-20 mx-auto'>
        <div className='w-1/3 h-[80vh] flex flex-col justify-end bg-loginbg-img bg-cover bg-center p-10 z-50 rounded-xl'>
          <h4 className='text-white font-bold text-4xl mb-3'>Capture your <br />Moments</h4>
          <p className='text-cyan-50 text-lg'>Save all your exciting stories and memories</p>
        </div>
        <div className='p-16 w-1/3 h-[70vh] bg-white rounded-r-lg relative shadow-lg shadow-cyan-200/20 flex flex-col items-start justify-center'>
          <form onSubmit={() => { }} className='w-full'>
            <h4 className='text-4xl font-bold mb-7'>Login</h4>
            <input type="email" placeholder='Enter your Email' className='input-email' />
            
            <div>
              <button className='btn-primary' type='submit'>SUBMIT</button>
              <p className='text-sm text-slate-500 text-center'>OR</p>
              <button type='submit' className='btn-light' onClick={() => { Navigate("/signup") }}>CREATE ACCOUNT</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
