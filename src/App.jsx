import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { 
  Login, 
  Index, 
  Users, 
  Genre, 
  Tags, 
  WatchAge, 
  Slider, 
  WebSeries, 
  Movies, 
  Content, 
  Trending,
  Category,
  Episodes,
  Season,
  EditContent,
  UploadVideo,
  UploadTrailer
} from "./UI";
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/index" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/home" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/genres" element={
        <ProtectedRoute>
          <Genre />
        </ProtectedRoute>
      } />
      <Route path="/tags" element={
        <ProtectedRoute>
          <Tags />
        </ProtectedRoute>
      } />
      <Route path="/age" element={
        <ProtectedRoute>
          <WatchAge />
        </ProtectedRoute>
      } />
      <Route path="/slider" element={
        <ProtectedRoute>
          <Slider />
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
      <Route path="/contents" element={
        <ProtectedRoute>
          <Content />
        </ProtectedRoute>
      } />
      <Route path="/trending" element={
        <ProtectedRoute>
          <Trending />
        </ProtectedRoute>
      } />
      <Route path="/category" element={
        <ProtectedRoute>
          <Category />
        </ProtectedRoute>
      } />
      <Route path="/episodes" element={
        <ProtectedRoute>
          <Episodes />
        </ProtectedRoute>
      } />
      <Route path="/season" element={
        <ProtectedRoute>
          <Season />
        </ProtectedRoute>
      } />
      <Route path="/edit-content" element={
        <ProtectedRoute>
          <EditContent />
        </ProtectedRoute>
      } />
      <Route path="/upload-video" element={
        <ProtectedRoute>
          <UploadVideo />
        </ProtectedRoute>
      } />
      <Route path="/upload-trailer" element={
        <ProtectedRoute>
          <UploadTrailer />
        </ProtectedRoute>
      } />
      <Route path="*" element={
        <div style={{
          color: 'white', 
          fontSize: '24px', 
          textAlign: 'center', 
          marginTop: '50px',
          background: '#1a1a1a',
          minHeight: '100vh',
          padding: '20px'
        }}>
          Page Not Found - Go back to <a href="/" style={{color: '#FFD700'}}>Login</a>
        </div>
      } />
    </Routes>
  );
}

export default App;
