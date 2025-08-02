import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose, MdHome, MdPeople, MdCategory, MdLocalOffer, MdSecurity, MdSlideshow, MdTv, MdMovie, MdCloudUpload, MdTrendingUp, MdLogout, MdDashboard } from "react-icons/md";
import { connect } from 'react-redux';
import { persistor } from '../../redux/store';
import { logoutUser } from "../../redux/user/user.actions";
import { useTheme } from "../../contexts/ThemeContext";

const EnhancedNavbar = ({ currentUser, logoutUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, isGolden, isEmerald } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic theme colors matching the dashboard
  const themeColors = {
    golden: {
      primary: '#FFD700',
      secondary: '#FFA500', 
      accent: '#FF8C00',
      gradient: 'linear-gradient(135deg, #FFD700, #FFA500, #FF8C00)',
      bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 50%, #1a1a1a 100%)',
      cardBg: 'rgba(255, 215, 0, 0.1)',
      textPrimary: '#FFD700',
      textSecondary: '#FFA500',
      borderColor: 'rgba(255, 215, 0, 0.3)',
      hoverBg: 'rgba(255, 215, 0, 0.1)'
    },
    emerald: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#047857', 
      gradient: 'linear-gradient(135deg, #10B981, #059669, #047857)',
      bgGradient: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)',
      cardBg: 'rgba(16, 185, 129, 0.1)',
      textPrimary: '#10B981',
      textSecondary: '#059669',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      hoverBg: 'rgba(16, 185, 129, 0.1)'
    }
  };

  const currentColors = themeColors[theme] || themeColors.golden;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    try {
      logoutUser();
      persistor.purge();
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Enhanced navigation items with icons and colors
  const navigationItems = [
    { 
      to: '/home', 
      icon: MdHome, 
      label: 'Dashboard', 
      color: currentColors.primary,
      description: 'Main overview'
    },
    { 
      to: '/users', 
      icon: MdPeople, 
      label: 'Users', 
      color: '#3B82F6',
      description: 'User management'
    },
    { 
      to: '/genres', 
      icon: MdCategory, 
      label: 'Genres', 
      color: '#8B5CF6',
      description: 'Content categories'
    },
    { 
      to: '/tags', 
      icon: MdLocalOffer, 
      label: 'Tags', 
      color: '#F59E0B',
      description: 'Content tags'
    },
    { 
      to: '/age', 
      icon: MdSecurity, 
      label: 'Watch Age', 
      color: '#EF4444',
      description: 'Age restrictions'
    },
    { 
      to: '/slider', 
      icon: MdSlideshow, 
      label: 'Slider', 
      color: '#10B981',
      description: 'Featured content'
    },
    { 
      to: '/webseries', 
      icon: MdTv, 
      label: 'Web Series', 
      color: '#6366F1',
      description: 'Series management'
    },
    { 
      to: '/movies', 
      icon: MdMovie, 
      label: 'Movies', 
      color: '#EC4899',
      description: 'Movie library'
    },
    { 
      to: '/contents', 
      icon: MdCloudUpload, 
      label: 'Upload Content', 
      color: '#F97316',
      description: 'Add new content'
    },
    { 
      to: '/trending', 
      icon: MdTrendingUp, 
      label: 'Trending', 
      color: '#DC2626',
      description: 'Popular content'
    }
  ];

  return (
    <>
      {/* Premium Animated Top Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="fixed top-0 left-0 w-full z-50 h-20 backdrop-blur-2xl border-b shadow-2xl overflow-hidden"
        style={{
          background: `${currentColors.bgGradient}, rgba(0,0,0,0.8)`,
          borderColor: currentColors.borderColor
        }}
      >
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${currentColors.primary}30 0%, transparent 50%), 
                        radial-gradient(circle at 80% 20%, ${currentColors.secondary}20 0%, transparent 50%)`
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="flex items-center justify-between px-8 py-4 h-full relative z-10">
          {/* Enhanced Logo */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background: currentColors.gradient
              }}
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.3 }
              }}
            >
              <MdDashboard className="text-white text-xl" />
              
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 opacity-50"
                style={{ borderColor: currentColors.primary }}
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

            <div>
              <motion.h1 
                className="text-2xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage: currentColors.gradient
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <Link to="/home">Yenumax</Link>
              </motion.h1>
              <motion.p 
                className="text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Content Management
              </motion.p>
            </div>
          </motion.div>

          {/* Enhanced Toggle Button */}
          <motion.button 
            className="relative p-4 rounded-2xl border backdrop-blur-lg overflow-hidden group"
            style={{
              backgroundColor: currentColors.hoverBg,
              borderColor: currentColors.borderColor
            }}
            onClick={toggleSidebar}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 20px 40px ${currentColors.primary}30`
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button background animation */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: `linear-gradient(45deg, ${currentColors.primary}20, ${currentColors.secondary}10)`
              }}
              transition={{ duration: 0.3 }}
            />

            <AnimatePresence mode="wait">
              {sidebarOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <MdClose 
                    className="text-2xl"
                    style={{ color: currentColors.textPrimary }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <GiHamburgerMenu 
                    className="text-2xl"
                    style={{ color: currentColors.textPrimary }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* Premium Animated Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-30 backdrop-blur-lg overflow-hidden"
            style={{
              background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.8) 100%)'
            }}
            onClick={toggleSidebar}
          >
            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-30"
                style={{
                  backgroundColor: currentColors.primary,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  scale: [0.5, 1, 0.5],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Animated Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -400, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 left-0 h-[calc(100%-5rem)] w-96 z-40 backdrop-blur-2xl overflow-hidden shadow-2xl border-r"
            style={{
              background: `linear-gradient(180deg, ${currentColors.cardBg}95 0%, rgba(0,0,0,0.95) 50%, ${currentColors.cardBg}95 100%)`,
              borderColor: currentColors.borderColor,
              boxShadow: `30px 0 60px rgba(0,0,0,0.7), 0 0 100px ${currentColors.primary}20`
            }}
          >
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, ${currentColors.primary}40 0%, transparent 50%),
                  radial-gradient(circle at 80% 60%, ${currentColors.secondary}30 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, ${currentColors.accent}20 0%, transparent 50%)
                `
              }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Sidebar Content */}
            <div className="relative z-10 h-full overflow-y-auto">
              {/* Header Section */}
              <motion.div 
                className="p-8 border-b relative overflow-hidden"
                style={{ borderColor: currentColors.borderColor }}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Header background glow */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(135deg, ${currentColors.primary}30, transparent)`
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <div className="relative z-10">
                  <motion.h3 
                    className="text-2xl font-bold mb-2 text-transparent bg-clip-text"
                    style={{
                      backgroundImage: currentColors.gradient
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    Navigation
                  </motion.h3>
                  <motion.p 
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Explore your content management suite
                  </motion.p>
                </div>
              </motion.div>
              
              {/* Premium Navigation Items */}
              <motion.div 
                className="px-8 pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.08 }}
              >
                <div className="space-y-3">
                  {navigationItems.map((item, index) => {
                    const isActive = location.pathname === item.to;
                    const IconComponent = item.icon;
                    
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.4 + (index * 0.05),
                          type: "spring",
                          stiffness: 100
                        }}
                      >
                        <Link 
                          to={item.to} 
                          className="group block relative"
                          onClick={toggleSidebar}
                        >
                          <motion.div
                            className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 overflow-hidden border ${
                              isActive 
                                ? 'shadow-xl' 
                                : 'hover:shadow-lg border-transparent hover:border-opacity-50'
                            }`}
                            style={{
                              background: isActive 
                                ? currentColors.gradient 
                                : 'rgba(255,255,255,0.02)',
                              borderColor: isActive 
                                ? 'transparent' 
                                : currentColors.borderColor,
                              transform: isActive ? 'scale(1.02)' : 'scale(1)'
                            }}
                            whileHover={{
                              scale: isActive ? 1.05 : 1.03,
                              backgroundColor: isActive ? undefined : `${item.color}15`,
                              boxShadow: `0 20px 40px ${item.color}30`,
                              transition: { duration: 0.3 }
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {/* Icon Container */}
                            <motion.div 
                              className="relative w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                              style={{
                                backgroundColor: isActive 
                                  ? 'rgba(255,255,255,0.2)' 
                                  : `${item.color}20`
                              }}
                              whileHover={{
                                backgroundColor: `${item.color}30`,
                                transition: { duration: 0.2 }
                              }}
                            >
                              <IconComponent 
                                size={24} 
                                style={{ 
                                  color: isActive ? 'white' : item.color,
                                  filter: isActive ? 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' : 'none'
                                }} 
                              />
                            </motion.div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <motion.h4 
                                className={`font-bold text-lg ${
                                  isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                }`}
                                whileHover={{
                                  x: 5,
                                  transition: { duration: 0.2 }
                                }}
                              >
                                {item.label}
                              </motion.h4>
                              <motion.p 
                                className={`text-xs ${
                                  isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-300'
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 + (index * 0.05) }}
                              >
                                {item.description}
                              </motion.p>
                            </div>

                            {/* Hover arrow indicator */}
                            <motion.div
                              className="opacity-0 group-hover:opacity-100 text-white"
                              initial={{ x: -10 }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              →
                            </motion.div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Premium Logout Section */}
                <motion.div
                  className="mt-8 pt-6 border-t relative overflow-hidden"
                  style={{ borderColor: currentColors.borderColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button 
                    onClick={handleLogout} 
                    className="group relative w-full flex items-center gap-4 px-5 py-4 rounded-2xl border overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderColor: 'rgba(239, 68, 68, 0.3)'
                    }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)',
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Logout icon container */}
                    <motion.div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                      whileHover={{
                        backgroundColor: 'rgba(239, 68, 68, 0.3)',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <MdLogout size={24} className="text-red-400" />
                    </motion.div>

                    {/* Logout text */}
                    <div className="flex-1 text-left">
                      <motion.h4 
                        className="font-bold text-lg text-red-400 group-hover:text-red-300"
                        whileHover={{
                          x: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        Logout
                      </motion.h4>
                      <p className="text-xs text-red-500 group-hover:text-red-400">
                        Sign out securely
                      </p>
                    </div>

                    {/* Logout arrow */}
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 text-red-400"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps, { logoutUser })(EnhancedNavbar);
