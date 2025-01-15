import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {
    return (
        userInfo && (<div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-full text-cyan-700 bg-slate-100 font-medium">
                {getInitials(userInfo?.fullName || "Guest")}
            </div>
            <div>
                <p className="text-sm font-medium">{userInfo?.fullName || "Guest"}</p>
                {userInfo && (
                    <button onClick={onLogout} className="text-slate-700 underline text-sm">
                        Logout
                    </button>
                )}
            </div>
        </div>
        )
    );
};


export default ProfileInfo
