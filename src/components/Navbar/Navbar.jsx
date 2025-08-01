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
      <nav className={`${isGolden ? 'bg-amber-600' : 'bg-emerald-600'} text-white flex items-center justify-between px-6 py-4 fixed top-0 left-0 w-full z-50 shadow-md h-16`}>
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
        className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gray-400 shadow-lg transform transition-transform duration-300 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Nav Links */}
        <ul className="p-4 space-y-4 text-white">
          <li><Link to="/home" className="text-lg hover:text-black font-bold hover:text-xl">Home</Link></li>
          <li><Link to="/users" className="text-lg hover:text-black font-bold hover:text-xl">Users</Link></li>
          <li><Link to="/genres" className="text-lg hover:text-black font-bold hover:text-xl">Genre</Link></li>
          <li><Link to="/tags" className="text-lg hover:text-black font-bold hover:text-xl">Tags</Link></li>
          <li><Link to="/age" className="text-lg hover:text-black font-bold hover:text-xl">Watch-age</Link></li>
          <li><Link to="/slider" className="text-lg hover:text-black font-bold hover:text-xl">Slider</Link></li>
          <li><Link to="/webseries" className="text-lg hover:text-black font-bold hover:text-xl">Webseries</Link></li>
          <li><Link to="/movies" className="text-lg hover:text-black font-bold hover:text-xl">Movies</Link></li>
          <li><Link to="/contents" className="text-lg hover:text-black font-bold hover:text-xl">Upload Content</Link></li>
          <li><Link to="/trending" className="text-lg hover:text-black font-bold hover:text-xl">Trending</Link></li>
          <li><a onClick={handleLogout} className="cursor-pointer text-lg hover:text-black font-bold hover:text-xl">Logout</a></li>
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