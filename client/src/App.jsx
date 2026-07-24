import { BrowserRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './layouts/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Tracks from './pages/Tracks';
import TrackDetails from './pages/TrackDetails';
import TopicDetails from './pages/TopicDetails';
import Roadmap from './pages/Roadmap';
import Bookmarks from './pages/Bookmarks';
import Practice from './pages/Practice';
import Interview from './pages/Interview';
import Admin from './pages/Admin';
import AuthContext from './contexts/AuthContext';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/tracks" element={<Tracks />} />
              <Route path="/tracks/:trackSlug" element={<TrackDetails />} />
              <Route path="/tracks/:trackSlug/interview" element={<Interview />} />
              <Route path="/tracks/:trackSlug/:topicSlug" element={<TopicDetails />} />
              <Route path="/tracks/:trackSlug/:topicSlug/practice" element={<Practice />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
