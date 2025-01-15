import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [isShowPassword, setIsShowPassword] = useState(false); 

    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <div className='flex items-center bg-green-600/5 px-5 rounded mb-3'>
            <input
                type={isShowPassword ? "text" : "password"} 
                value={value}
                onChange={onChange}
                placeholder={placeholder || "Enter Password"}
                className='w-full bg-transparent py-3 mr-3 rounded outline-none text-sm'
            />
            {isShowPassword ? (
                <FaRegEye
                    size={22}
                    className='text-green-500 cursor-pointer'
                    onClick={toggleShowPassword} 
                />
            ) : (
                <FaRegEyeSlash
                    size={22}
                    className='text-slate-400 cursor-pointer'
                    onClick={toggleShowPassword} 
                />
            )}
        </div>
    );
};

export default PasswordInput;
