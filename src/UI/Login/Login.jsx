import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaVideo, FaEye, FaEyeSlash } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import axiosInstance from '../../api/axios';

import { connect } from "react-redux";

import { setCurrentUser } from "../../redux/user/user.actions";

const Login = ({setCurrentUser}) => {
	const navigate = useNavigate();
	
	const [ userInput, setUserInput ] = useState({
		email: '',
		password: ''
	})

	const [ inputError, setInputError ] = useState({
		email: '',
		password: ''
	})

	const [ showPassword, setShowPassword ] = useState(false);
	const [ errMsg, setErrMsg ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const handleEmailChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			email: e.target.value}
		})
	}

	const handlePasswordChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			password: e.target.value}
		})
	}

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

    	if (!userInput.email || !userInput.password) {
    		setInputError((prevState) => {
	    		return {
	    			...prevState,
	    			email: userInput.email === '' ? true : false,
	    			password: userInput.password === '' ? true : false
	    		}
	    	});
    		return;
    	}

	    	try {
	    		setIsLoading(true);

				const response = await axiosInstance.post('/api/v1/auth/login',
	    			{
					    email: userInput.email,
					    password: userInput.password
					},
					{
					    headers: {
							'Content-Type': 'application/json',
					    },
					    withCredentials: true,
					}
	    		);

	    		// console.log(response.data);

	    		if (response.data && response.data?.isSuccess) {
	    			setUserInput({
	    				email: '',
	    				password: ''
	    			})

	    			setCurrentUser({
					  email: userInput.email,
					  token: response.data.token
					});

	    			// After login, navigate to the home page (Netflix-style)
	    			navigate('/home', { replace: true });
	    		}

	    		else {
	    			setErrMsg(response.data?.message);
	    			window.scrollTo({ top: 0, behavior: 'smooth' });
	    		}
	    	}

	    	catch (error) {
	    		window.scrollTo({ top: 0, behavior: 'smooth' });

	    		console.log(error);
	    		if (!error?.response) {
	    			setErrMsg("Failed to Login In. Try Again...");
	    		}
	    		else if (error.response?.status === 400 && !error.response.data?.isSuccess) {
	    			setErrMsg(error.response?.data.message);
	    		}

	    		else if (error.response?.status === 401 || error.response?.status === 404) {
	    			setErrMsg(error.response?.data.message);
	    		}

	    		else {
	    			setErrMsg("Login Failed...");
	    		}
	    	}

	    	finally {
				setIsLoading(false);
		    }
	}

  	return (
	    <div className="flex h-screen font-sans">
		    {/* Left Panel */}
		    <div className="w-0 md:w-1/2 bg-blue-600 text-white hidden md:flex flex-col items-center justify-center px-10 text-center">
		        <div className="bg-white/20 p-6 rounded-full mb-6">
		          <FaVideo size={48} />
		        </div>
		        <h1 className="text-4xl font-bold mb-2">Content Admin</h1>
		        <p className="text-lg mb-1">Manage your video content platform</p>
		        <p className="text-sm opacity-80">Professional content management system</p>
		    </div>

		    {/* Right Panel */}
		    <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 sm:px-8">
		    	{isLoading ? (
	              <div className="relative z-10 flex justify-center items-center h-50 pt-10">
	                <div className="animate-spin h-12 w-12 border-4 border-blue-800 rounded-full border-t-transparent"></div>
	              </div>
	            ) : (
			        <div className="w-full max-w-md space-y-6">
			          <div>
			            <h2 className="text-2xl text-center font-bold text-gray-800 mb-1">Welcome back</h2>
			            <p className="text-gray-500 text-center">Sign in to your admin account</p>
			          </div>

			          {errMsg && (
			            <div className="mb-4 px-4 py-2 text-red-600 bg-red-100 border border-red-200 rounded w-full max-w-4xl">
			              {errMsg}
			            </div>
			          )}

			          <form onSubmit={handleSubmit} className="space-y-7">
			            <div>
			              	<label className="block text-gray-600 font-semibold mb-1">Email address</label>
			              	<div className={`relative ${inputError.email === true ? 'border-red-500' : 'border-gray-600'}`}>
					            <input
					                type="email"
					                value={userInput.email}
									onChange={handleEmailChange}
					                placeholder="admin@example.com"
					                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
					            />
					        </div>
							{inputError.email === true && <p className="text-red-500 text-xs">Please enter a valid email address.</p>}
			            </div>

			            <div>
			              <label className="block text-gray-600 font-semibold mb-1">Password</label>
			              <div className={`relative ${inputError.password === true ? 'border-red-500' : 'border-gray-600'}`}>
			                <input
			                  type={showPassword ? "text" : "password"}
			                  value={userInput.password}
							  onChange={handlePasswordChange}
			                  placeholder="Enter your password"
			                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none pr-10"
			                />
			                <button
								type="button"
								onClick={togglePasswordVisibility}
								className="absolute right-1 top-3 cursor-pointer text-gray-400 pr-3 hover:text-emerald-500 transition duration-300"
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</button>
			              </div>
			              {inputError.password === true && <p className="text-red-500 text-xs">Please enter your password</p>}
			            </div>

			            <button
			              type="submit"
			              className="w-full py-2 bg-blue-600 cursor-pointer uppercase hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2"
			            >
			              <CiLogin className="text-white text-2xl font-bold" />
			              Sign In
			            </button>
			          </form>

			          <div className="bg-gray-100 text-center p-4 text-sm rounded text-gray-700">
			            <p><strong>Default Admin Credentials:</strong></p>
			            <p>Email: admin@example.com</p>
			            <p>Password: admin123</p>
			          </div>
			        </div>
			    )}
		    </div>
	    </div>
  	);
};

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);