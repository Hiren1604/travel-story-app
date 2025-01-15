import React, { useState } from 'react';
import SignUpPasswordInput from '../../components/input/SignUpPasswordInput';
import { useNavigate } from "react-router-dom";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter a name.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setError(null);

    // API Call
    try {
      const response = await axiosInstance.post("/create-account", { fullName: name, email: email, password: password });

      if (response?.data) {
        // Redirect to login page
        navigate("/login", { state: { successMessage: "Account created successfully. Please log in." } });
      } else {
        setError("Account creation failed. Please try again.");
      }
    } catch (error) {
      const { response } = error;
      if (response?.data?.message) {
        setError(response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="overflow-hidden bg-green-50 h-screen relative">
      <div className="container flex justify-center items-center h-screen px-20 mx-auto">
        <div className="p-16 w-1/3 h-[70vh] bg-white rounded-r-lg relative shadow-lg shadow-green-200/20 flex flex-col items-start justify-center">
          <form onSubmit={handleSignUp} className="w-full">
            <h4 className="text-4xl font-bold mb-7">Sign Up</h4>
            <input
              type="text"
              placeholder="Enter your Name"
              className="input-sign-email"
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
            <input
              type="text"
              placeholder="Enter your Email"
              className="input-sign-email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <SignUpPasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <div>
              <button className="btn-primary-sign" type="submit">CREATE ACCOUNT</button>
              <p className="text-sm text-slate-500 text-center">OR</p>
              <button type="button" className="btn-light-sign" onClick={() => navigate("/login")}>LOGIN</button>
            </div>
          </form>
        </div>
        <div className="w-1/3 h-[80vh] flex flex-col justify-end bg-signupbg-img bg-cover bg-center p-10 z-50 rounded-xl">
          <h4 className="text-white font-bold text-4xl mb-2">Explore,<br />Capture, <br />Remember.</h4>
          <p className="text-green-50 text-lg">Sign up now and turn your adventures into everlasting stories.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
