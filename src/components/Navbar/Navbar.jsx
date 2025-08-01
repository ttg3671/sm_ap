import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { connect } from 'react-redux';
import { persistor } from '../../redux/store';
import { logoutUser } from "../../redux/user/user.actions";
import { useTheme } from "../../contexts/ThemeContext";

const Navbar = ({ currentUser, logoutUser }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isGolden, isEmerald } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logoutUser();
      persistor.purge();
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className={`${isGolden ? 'bg-gradient-to-r from-amber-700 to-yellow-700 shadow-lg shadow-amber-200' : 'bg-gradient-to-r from-emerald-700 to-teal-700 shadow-lg shadow-emerald-200'} text-white flex items-center justify-between px-6 py-4 fixed top-0 left-0 w-full z-50 h-16 backdrop-blur-sm`}>
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/home">Yenumax</Link>
        </div>

        {/* Toggle Icon */}
        <button className="text-3xl cursor-pointer" onClick={toggleSidebar}>
          <GiHamburgerMenu />
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 ${isGolden ? 'bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100 border-r-4 border-amber-300' : 'bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-100 border-r-4 border-emerald-300'} shadow-2xl transform transition-all duration-300 z-40 backdrop-blur-sm ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 ${isGolden ? 'bg-gradient-to-r from-amber-600 to-yellow-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'} text-white`}>
          <h3 className="text-lg font-bold">Navigation</h3>
        </div>
        
        {/* Nav Links */}
        <ul className="p-4 space-y-3">
          <li><Link to="/home" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🏠 Home</Link></li>
          <li><Link to="/users" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>👥 Users</Link></li>
          <li><Link to="/genres" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🎭 Genre</Link></li>
          <li><Link to="/tags" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🏷️ Tags</Link></li>
          <li><Link to="/age" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🔞 Watch-age</Link></li>
          <li><Link to="/slider" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🎞️ Slider</Link></li>
          <li><Link to="/webseries" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>📺 Webseries</Link></li>
          <li><Link to="/movies" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🎬 Movies</Link></li>
          <li><Link to="/contents" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>⬆️ Upload Content</Link></li>
          <li><Link to="/trending" className={`block text-lg font-semibold ${isGolden ? 'text-amber-800 hover:text-amber-600 hover:bg-amber-100' : 'text-emerald-800 hover:text-emerald-600 hover:bg-emerald-100'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🔥 Trending</Link></li>
          <li><a onClick={handleLogout} className={`block cursor-pointer text-lg font-semibold ${isGolden ? 'text-red-600 hover:text-red-500 hover:bg-red-50' : 'text-red-600 hover:text-red-500 hover:bg-red-50'} px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105`}>🚪 Logout</a></li>
        </ul>
      </div>

      {/* Overlay that starts below navbar */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed top-16 left-0 w-full h-[calc(100%-4rem)] bg-black opacity-40 z-30"
        />
      )}
    </>
  );
};

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps, { logoutUser })(Navbar);