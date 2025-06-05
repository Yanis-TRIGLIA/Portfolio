import { RouterProvider } from 'react-router-dom';
import { router } from './routes/routes';
import { AuthProvider } from './context/AuthContext'; // ← nouveau
import './App.css';
import Headers from './components/basics/Header';

function App() {
  return (
    
    <AuthProvider>
      <Headers></Headers>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
