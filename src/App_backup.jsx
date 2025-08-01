import { Fragment, useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import { 
  Login,
  Category,
  Genre,
  WatchAge,
  Tags,
  Content,
  WebSeries,
	Movies,
  Slider,
  Season,
  Episodes,
  Home,
  EditContent,
  UploadVideo,
  UploadTrailer,
  Trending,
  Index,
  Users
} from "./UI";

import { ContentCardList } from "./components";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/index" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        } />
        <Route path="/genres" element={
          <ProtectedRoute>
            <Genre />
          </ProtectedRoute>
        } />
        <Route path="/age" element={
          <ProtectedRoute>
            <WatchAge />
          </ProtectedRoute>
        } />
        <Route path="/tags" element={
          <ProtectedRoute>
            <Tags />
          </ProtectedRoute>
        } />
        <Route path="/trending" element={
          <ProtectedRoute>
            <Trending />
          </ProtectedRoute>
        } />
        <Route path="/contents" element={
          <ProtectedRoute>
            <Content />
          </ProtectedRoute>
        } />
        <Route path="/webseries" element={
          <ProtectedRoute>
            <WebSeries />
          </ProtectedRoute>
        } />
        <Route path="/movies" element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        } />
        <Route path="/slider" element={
          <ProtectedRoute>
            <Slider />
          </ProtectedRoute>
        } />
        <Route path="/season/:series_id" element={
          <ProtectedRoute>
            <Season />
          </ProtectedRoute>
        } />
        <Route path="/episodes" element={
          <ProtectedRoute>
            <Episodes />
          </ProtectedRoute>
        } />
        <Route path="/edit/:id/:type" element={
          <ProtectedRoute>
            <EditContent />
          </ProtectedRoute>
        } />
        <Route path="/trailers/:id/:type" element={
          <ProtectedRoute>
            <UploadTrailer />
          </ProtectedRoute>
        } />
        <Route path="/videos/:id/:type" element={
          <ProtectedRoute>
            <UploadVideo />
          </ProtectedRoute>
        } />
        
        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Fragment>
  )
}

export default App
