import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineHeart } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';
import { BsAward } from 'react-icons/bs';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';
import { useTheme } from '../../contexts/ThemeContext';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { changeTheme } = useTheme();
  
  // Get state from Redux store with fallback
  const auth = useSelector((state) => state?.auth || {});
  const { loading = false, error = '' } = auth;
  
  // Local state for theme and form
  const [currentTheme, setCurrentTheme] = useState('golden');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [particles, setParticles] = useState([]);

  // Generate particles
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
    setParticles(newParticles);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // Use relative URL to leverage Vercel rewrites in production and Vite proxy in development
      const baseURL = '/api/v1';

      // Call actual API for authentication
      const response = await fetch(`${baseURL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.isSuccess && result.token) {
          const userData = { 
            name: result.admin?.name || "Admin", 
            email: formData.email,
            role: "administrator",
            loginTime: new Date().toISOString()
          };
          
          // Use Redux auth slice
          dispatch(loginSuccess({ 
            user: userData, 
            token: result.token 
          }));
          
          // Store token for API calls
          sessionStorage.setItem('authToken', result.token);
          sessionStorage.setItem('userEmail', formData.email);
          
          // Save selected theme for dashboard
          changeTheme(currentTheme);
          sessionStorage.setItem('selectedTheme', currentTheme);
          localStorage.setItem('selectedTheme', currentTheme);
          
          window.dispatchEvent(new Event('sessionStorageChange'));
          
          navigate('/index');
        } else {
          dispatch(loginFailure(result.message || 'Login failed'));
        }
      } else {
        // For demo purposes, allow a fallback login if the API is not available
        if (formData.email === 'admin@yenumax.com' && formData.password === 'maxYenu@1847') {
          console.warn('Using demo login because API is not available');
          
          const userData = { 
            name: "YenuMax Admin", 
            email: formData.email,
            role: "administrator",
            loginTime: new Date().toISOString()
          };
          
          // Generate a more realistic token for development
          const demoToken = btoa(`${formData.email}:${new Date().getTime()}`);
          
          dispatch(loginSuccess({ 
            user: userData, 
            token: demoToken
          }));
          
          sessionStorage.setItem('authToken', demoToken);
          sessionStorage.setItem('userEmail', formData.email);
          
          // Save selected theme for dashboard
          changeTheme(currentTheme);
          sessionStorage.setItem('selectedTheme', currentTheme);
          localStorage.setItem('selectedTheme', currentTheme);
          
          window.dispatchEvent(new Event('sessionStorageChange'));
          navigate('/index');
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        dispatch(loginFailure(errorData.message || 'Invalid credentials or server error'));
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Fallback login for demo/development when API is unreachable
      if (formData.email === 'admin@yenumax.com' && formData.password === 'maxYenu@1847') {
        console.warn('Using demo login because API is not reachable');
        
        const userData = { 
          name: "YenuMax Admin", 
          email: formData.email,
          role: "administrator",
          loginTime: new Date().toISOString()
        };
        
        // Generate a more realistic token for development
        const demoToken = btoa(`${formData.email}:${new Date().getTime()}`);
        
        dispatch(loginSuccess({ 
          user: userData, 
          token: demoToken
        }));
        
        sessionStorage.setItem('authToken', demoToken);
        sessionStorage.setItem('userEmail', formData.email);
        window.dispatchEvent(new Event('sessionStorageChange'));
        navigate('/index');
      } else if (!formData.email || !formData.password) {
        dispatch(loginFailure('Please fill in all fields'));
      } else {
        dispatch(loginFailure('Invalid email or password. Use: admin@yenumax.com / maxYenu@1847'));
      }
    }
    
    /* 
    // Backend API login code - commented out since server is not available
    try {
      // Call actual API for authentication
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const result = await response.json();
        const userData = { 
          name: result.user?.name || "Admin", 
          email: formData.email,
          role: result.user?.role || "administrator",
          loginTime: new Date().toISOString()
        };
        
        // Use Redux auth slice
        dispatch(loginSuccess({ 
          user: userData, 
          token: result.token 
        }));
        
        // Store token for API calls
        sessionStorage.setItem('authToken', result.token);
        sessionStorage.setItem('userEmail', formData.email);
        window.dispatchEvent(new Event('sessionStorageChange'));
        
        navigate('/index');
      } else {
        const errorData = await response.json();
        dispatch(loginFailure(errorData.message || 'Login failed'));
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure('Connection error. Server might be down.'));
    }
    */
  };

  const handleThemeSwitch = (theme) => {
    setCurrentTheme(theme);
  };

  const themeColors = {
    golden: {
      primary: '#FFD700',
      secondary: '#FFA500',
      accent: '#FF8C00',
      gradient: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
      bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
      cardBg: 'rgba(255, 215, 0, 0.1)'
    },
    emerald: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#047857',
      gradient: 'linear-gradient(135deg, #10B981, #059669, #047857)',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)',
      cardBg: 'rgba(16, 185, 129, 0.1)'
    }
  };

  const currentColors = themeColors[currentTheme] || themeColors.golden;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      className="login-container"
      style={{
        minHeight: '100vh',
        background: currentColors.bgGradient,
        position: 'relative',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Animated Background Particles */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: currentColors.primary,
            borderRadius: '50%',
            opacity: particle.opacity
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Main Login Card */}
      <motion.div
        className="login-card"
        style={{
          background: `rgba(255, 255, 255, 0.1)`,
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '25px 20px',
          width: '90%',
          maxWidth: '450px',
          minWidth: '280px',
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          boxShadow: `0 15px 30px rgba(0, 0, 0, 0.25), 0 0 70px ${currentColors.primary}20`,
          position: 'relative',
          margin: '15px 0',
          boxSizing: 'border-box'
        }}
        variants={cardVariants}
        whileHover={{
          y: -3,
          boxShadow: `0 25px 50px rgba(0, 0, 0, 0.3), 0 0 100px ${currentColors.primary}30`,
          transition: { duration: 0.3 }
        }}
        initial={{
          borderRadius: '16px',
          padding: '25px 20px',
        }}
        animate={{
          borderRadius: ['16px', '20px', '24px'],
          padding: ['25px 20px', '30px 30px', '40px'],
          transition: {
            duration: 0.3,
            delay: 0.2,
            ease: "easeInOut",
            when: "beforeChildren",
            staggerChildren: 0.05
          }
        }}
      >
        {/* Logo Section */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}
          variants={itemVariants}
        >
          <motion.div
            className="logo-container"
            style={{
              width: '80px',
              height: '80px',
              background: currentColors.gradient,
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FiLogIn color="white" size={32} />
            <motion.div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: currentColors.gradient,
                opacity: 0.5
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
          
          <motion.h1
            className="main-title"
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }}
            variants={itemVariants}
          >
            Admin Panel
          </motion.h1>
          
          <motion.p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              marginBottom: '30px'
            }}
            variants={itemVariants}
          >
            Welcome back! Please sign in to continue.
          </motion.p>

          {/* Theme Cards */}
          <motion.div
            className="theme-cards"
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '30px',
              flexWrap: 'wrap'
            }}
            variants={itemVariants}
          >
            {/* Golden Theme Card */}
            <motion.div
              className="theme-card"
              onClick={() => handleThemeSwitch('golden')}
              style={{
                flex: 1,
                padding: '20px',
                borderRadius: '16px',
                background: currentTheme === 'golden' ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255, 215, 0, 0.1)',
                border: currentTheme === 'golden' ? '2px solid #FFD700' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                position: 'relative',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: currentTheme === 'golden' ? 'rgba(255, 255, 255, 0.3)' : '#FFD700',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {currentTheme === 'golden' && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white'
                  }} />
                )}
              </motion.div>
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}
              >
                <BsAward 
                  color={currentTheme === 'golden' ? 'white' : '#FFD700'} 
                  size={24}
                />
              </motion.div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: currentTheme === 'golden' ? 'white' : '#FFD700',
                marginBottom: '4px'
              }}>
                Golden
              </div>
              <div style={{
                fontSize: '12px',
                color: currentTheme === 'golden' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 215, 0, 0.8)'
              }}>
                Luxury & Elegance
              </div>
            </motion.div>

            {/* Emerald Theme Card */}
            <motion.div
              className="theme-card"
              onClick={() => handleThemeSwitch('emerald')}
              style={{
                flex: 1,
                padding: '20px',
                borderRadius: '16px',
                background: currentTheme === 'emerald' ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(16, 185, 129, 0.1)',
                border: currentTheme === 'emerald' ? '2px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                position: 'relative',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: currentTheme === 'emerald' ? 'rgba(255, 255, 255, 0.3)' : '#10B981',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {currentTheme === 'emerald' && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'white'
                  }} />
                )}
              </motion.div>
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}
              >
                <AiOutlineHeart 
                  color={currentTheme === 'emerald' ? 'white' : '#10B981'} 
                  size={24}
                />
              </motion.div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: currentTheme === 'emerald' ? 'white' : '#10B981',
                marginBottom: '4px'
              }}>
                Emerald
              </div>
              <div style={{
                fontSize: '12px',
                color: currentTheme === 'emerald' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(16, 185, 129, 0.8)'
              }}>
                Fresh & Nature
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Login Form */}
        <motion.form onSubmit={handleSubmit} variants={itemVariants}>
          {/* Email Field */}
          <motion.div
            style={{ marginBottom: '24px' }}
            variants={itemVariants}
          >
            <motion.label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: currentColors.primary,
                fontSize: '14px',
                fontWeight: '600'
              }}
              whileHover={{ scale: 1.02 }}
            >
              Email Address
            </motion.label>
            <motion.div style={{ position: 'relative' }}>
              <motion.input
                className="input-field"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 16px',
                  borderRadius: '12px',
                  border: `2px solid rgba(255, 255, 255, 0.1)`,
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  lineHeight: '1.5',
                  height: '56px'
                }}
                whileFocus={{
                  borderColor: currentColors.primary,
                  boxShadow: `0 0 20px ${currentColors.primary}40`
                }}
                required
              />
              <AiOutlineMail
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: currentColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}
                size={22}
              />
            </motion.div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            style={{ marginBottom: '32px' }}
            variants={itemVariants}
          >
            <motion.label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: currentColors.primary,
                fontSize: '14px',
                fontWeight: '600'
              }}
              whileHover={{ scale: 1.02 }}
            >
              Password
            </motion.label>
            <motion.div style={{ position: 'relative' }}>
              <motion.input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 16px',
                  borderRadius: '12px',
                  border: `2px solid rgba(255, 255, 255, 0.1)`,
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  lineHeight: '1.5',
                  height: '56px'
                }}
                whileFocus={{
                  borderColor: currentColors.primary,
                  boxShadow: `0 0 20px ${currentColors.primary}40`
                }}
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: currentColors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  zIndex: 10,
                  borderRadius: '6px'
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <AiOutlineEyeInvisible size={22} /> : <AiOutlineEye size={22} />}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#ff6b6b',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            className="submit-button"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: currentColors.gradient,
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            animate={{
              padding: ['14px', '15px', '16px'],
              borderRadius: ['10px', '11px', '12px'],
              fontSize: ['15px', '15.5px', '16px'],
              transition: { duration: 0.3, delay: 0.4 }
            }}
            whileHover={!loading ? {
              scale: 1.02,
              boxShadow: `0 10px 30px ${currentColors.primary}40`
            } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            variants={itemVariants}
          >
            <motion.div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <>
                  <FiLogIn size={20} />
                  Sign In
                </>
              )}
            </motion.div>
            
            {/* Button glow effect */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                pointerEvents: 'none'
              }}
              animate={{
                left: ['100%', '-100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          body {
            overflow-x: hidden;
          }
        }
        
        @media (max-width: 480px) {
          .login-card {
            padding: 24px !important;
            margin: 10px !important;
            border-radius: 16px !important;
          }
          
          .theme-cards {
            flex-direction: column !important;
            gap: 12px !important;
          }
          
          .theme-card {
            padding: 16px !important;
          }
          
          .logo-container {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 16px !important;
          }
          
          .main-title {
            font-size: 24px !important;
          }
          
          .input-field {
            padding: 12px 16px !important;
            font-size: 16px !important;
          }
          
          .submit-button {
            padding: 14px !important;
            font-size: 16px !important;
          }
        }
        
        @media (max-height: 700px) {
          .login-container {
            align-items: flex-start !important;
            padding-top: 40px !important;
          }
        }
        
        /* Ensure proper scrolling on all devices */
        html, body {
          overflow-x: hidden;
          scroll-behavior: smooth;
        }
        
        /* Touch device optimization */
        @media (hover: none) and (pointer: coarse) {
          .theme-card, .submit-button {
            transform: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LoginPage;

// Also export as Login for backward compatibility
export { LoginPage as Login };