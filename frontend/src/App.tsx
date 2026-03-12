import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const API_BASE = `${import.meta.env.VITE_API_BASE}api`;

function App() {
  useEffect(() => {
    fetch(`${API_BASE}/visitor/track`, { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
