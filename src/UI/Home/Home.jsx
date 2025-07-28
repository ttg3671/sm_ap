import { useState, useEffect, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outer, Navbar } from "../../components";
import { MdOutlineDashboardCustomize } from "react-icons/md"; // Example icon from react-icons

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    <Fragment>
      <Outer>
        <Navbar />

        {/* Main content area, taking up remaining space and centering its content */}
        <div className="col-span-full flex flex-grow items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Welcome Card/Container */}
          <div className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 md:p-12 text-center max-w-2xl w-full transform transition-all duration-300 hover:scale-[1.01] hover:shadow-3xl relative overflow-hidden">
            {/* Subtle Gradient Overlay (Optional, but adds depth) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70 rounded-xl -z-10"></div>
            {/* Background pattern (Optional, for more flair) */}
            <div
              className="absolute inset-0 z-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 34v-4h-2v4H6v2h4v4h2v-4h4v-2h-4zm0 0v-4h-2v4H6v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            ></div>

            {/* Icon */}
            <div className="mb-6 text-indigo-600">
              <MdOutlineDashboardCustomize className="mx-auto h-16 w-16 sm:h-20 sm:w-20 animate-bounce-slow" /> {/* Larger, animated icon */}
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              Welcome to the <span className="text-indigo-600">Yenumax</span> Admin Panel
            </h1>

            {/* Sub-heading/Description */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Manage your content, users, and settings with ease. Use the navigation bar to get started.
            </p>

            {/* Call to Action (Optional - you might want to link to a dashboard or content page) */}
            <button
              onClick={() => navigate("/users")}
              className="px-6 py-3 cursor-pointer bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </Outer>
    </Fragment>
  );
};

export default Home;