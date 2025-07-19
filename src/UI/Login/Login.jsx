import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
		email: false,
		password: false
	})

	const [ showPassword, setShowPassword ] = useState(false);
	const [ errMsg, setErrMsg ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const handleEmailChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			email: e.target.value}
		})
		// Clear email error when user starts typing
		if (inputError.email) {
			setInputError(prev => ({ ...prev, email: false }));
		}
	}

	const handlePasswordChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			password: e.target.value}
		})
		// Clear password error when user starts typing
		if (inputError.password) {
			setInputError(prev => ({ ...prev, password: false }));
		}
	}

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	}

	const validateForm = () => {
		const errors = {
			email: !userInput.email.trim(),
			password: !userInput.password.trim()
		};
		
		setInputError(errors);
		return !errors.email && !errors.password;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrMsg(''); // Clear previous error messages

		// Validate form
		if (!validateForm()) {
			return;
		}

		try {
			setIsLoading(true);

			// Check if BASE_URL is configured
			const baseURL = import.meta.env.VITE_BASE_URL;
			if (!baseURL) {
				throw new Error("API base URL is not configured. Please check your environment variables.");
			}

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

			console.log('Login response:', response.data);

			if (response.data && response.data?.isSuccess) {
				setUserInput({
					email: '',
					password: ''
				})

				const userData = {
					email: userInput.email,
					token: response.data.token
				};

				console.log('Setting user data:', userData);
				setCurrentUser(userData);

				// After login, navigate to the home page (Netflix-style)
				navigate('/home', { replace: true });
			} else {
				setErrMsg(response.data?.message || 'Login failed. Please try again.');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		} catch (error) {
			window.scrollTo({ top: 0, behavior: 'smooth' });

			console.error('Login error:', error);
			
			if (error.message && error.message.includes('BASE_URL')) {
				setErrMsg("Configuration error: API base URL is not set. Please contact administrator.");
			} else if (!error?.response) {
				setErrMsg("Network error: Unable to connect to server. Please check your internet connection.");
			} else if (error.response?.status === 400 && !error.response.data?.isSuccess) {
				setErrMsg(error.response?.data.message || "Invalid credentials. Please check your email and password.");
			} else if (error.response?.status === 401 || error.response?.status === 404) {
				setErrMsg(error.response?.data.message || "Authentication failed. Please check your credentials.");
			} else {
				setErrMsg("Login failed. Please try again later.");
			}
		} finally {
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
		              	<div className={`relative ${inputError.email ? 'border-red-500' : 'border-gray-300'}`}>
				            <input
				                type="email"
				                value={userInput.email}
								onChange={handleEmailChange}
				                placeholder="admin@example.com"
				                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${inputError.email ? 'border-red-500' : 'border-gray-300'}`}
				            />
				        </div>
						{inputError.email && <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>}
		            </div>

		            <div>
		              <label className="block text-gray-600 font-semibold mb-1">Password</label>
		              <div className={`relative ${inputError.password ? 'border-red-500' : 'border-gray-300'}`}>
		                <input
		                  type={showPassword ? "text" : "password"}
		                  value={userInput.password}
						  onChange={handlePasswordChange}
		                  placeholder="Enter your password"
		                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none pr-10 ${inputError.password ? 'border-red-500' : 'border-gray-300'}`}
		                />
		                <button
							type="button"
							onClick={togglePasswordVisibility}
							className="absolute right-1 top-3 cursor-pointer text-gray-400 pr-3 hover:text-emerald-500 transition duration-300"
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</button>
		              </div>
		              {inputError.password && <p className="text-red-500 text-xs mt-1">Please enter your password</p>}
		            </div>

		            <button
		              type="submit"
		              disabled={isLoading}
		              className={`w-full py-2 bg-blue-600 cursor-pointer uppercase hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
		            >
		              {isLoading ? (
		                <>
		                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
		                  Signing In...
		                </>
		              ) : (
		                <>
		                  <CiLogin className="text-white text-2xl font-bold" />
		                  Sign In
		                </>
		              )}
		            </button>
		          </form>

		          <div className="bg-gray-100 text-center p-4 text-sm rounded text-gray-700">
		            <p><strong>Default Admin Credentials:</strong></p>
		            <p>Email: admin@example.com</p>
		            <p>Password: admin123</p>
		          </div>
		        </div>
		    </div>
	    </div>
  	);
};

const mapDispatchToProps = dispatch => ({
	setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);