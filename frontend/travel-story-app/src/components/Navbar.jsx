import React from 'react'
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'

const Navbar = ({userInfo}) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    }
    return (
        <div>
            <div className='bg-white flex items-center justify-between px-6 py-3 drop-shadow sticky top-0 z-10'>
                <h1 className='logo font-bold text-2xl text-primary'>StoryScape</h1>
                {isToken && <ProfileInfo userInfo = {userInfo} onLogout={onLogout}/>}
            </div>
            
        </div>
    )
}

export default Navbar
