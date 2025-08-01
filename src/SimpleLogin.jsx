import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMail, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineHeart } from 'react-icons/ai';
import { FiLogIn } from 'react-icons/fi';
import { BsAward } from 'react-icons/bs';

const SimpleLogin = () => {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState('golden');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    setLoading(true);
    setError('');
    
    // Simple hardcoded authentication
    if (formData.email === "admin@yenumax.com" && formData.password === "maxYenu@1847") {
      sessionStorage.setItem('authToken', 'demo-token-12345');
      sessionStorage.setItem('userEmail', formData.email);
      setLoading(false);
      navigate('/index');
    } else if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
    } else {
      setError('Invalid email or password. Use: admin@yenumax.com / maxYenu@1847');
      setLoading(false);
    }
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
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
          borderRadius: '24px',
          padding: '40px',
          width: '90%',
          maxWidth: '450px',
          minWidth: '280px',
          border: `1px solid rgba(255, 255, 255, 0.2)`,
          boxShadow: `0 25px 50px rgba(0, 0, 0, 0.3), 0 0 100px ${currentColors.primary}30`,
          position: 'relative',
          margin: '15px 0',
          boxSizing: 'border-box'
        }}
        initial={{ y: 50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          y: -3,
          boxShadow: `0 35px 70px rgba(0, 0, 0, 0.4), 0 0 120px ${currentColors.primary}40`,
          transition: { duration: 0.3 }
        }}
      >
        {/* Logo Section */}
        <motion.div
          style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
          </motion.div>
          
          <motion.h1
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px'
            }}
          >
            Admin Panel
          </motion.h1>
          
          <motion.p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '16px',
              marginBottom: '30px'
            }}
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
              <BsAward 
                color={currentTheme === 'golden' ? 'white' : '#FFD700'} 
                size={24}
                style={{ marginBottom: '8px' }}
              />
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
              <AiOutlineHeart 
                color={currentTheme === 'emerald' ? 'white' : '#10B981'} 
                size={24}
                style={{ marginBottom: '8px' }}
              />
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
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Email Field */}
          <motion.div style={{ marginBottom: '24px' }}>
            <motion.label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: currentColors.primary,
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Email Address
            </motion.label>
            <motion.div style={{ position: 'relative' }}>
              <motion.input
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
                  boxSizing: 'border-box'
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
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}
                size={20}
              />
            </motion.div>
          </motion.div>

          {/* Password Field */}
          <motion.div style={{ marginBottom: '32px' }}>
            <motion.label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: currentColors.primary,
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Password
            </motion.label>
            <motion.div style={{ position: 'relative' }}>
              <motion.input
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
                  boxSizing: 'border-box'
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
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
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
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: currentColors.gradient,
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={!loading ? {
              scale: 1.02,
              boxShadow: `0 10px 30px ${currentColors.primary}40`
            } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
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
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default SimpleLogin;
