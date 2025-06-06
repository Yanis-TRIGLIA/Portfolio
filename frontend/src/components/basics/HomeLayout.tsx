import  { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Headers from './Header';
import LoadingScreen from '../LoadingScreen';

const HomeLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(location.pathname === '/');

  useEffect(() => {
    if (location.pathname === '/') {
      setLoading(true);
    } else {
      setLoading(false); 
    }
  }, [location]);

  return (
    <>
      <Headers />
      {loading && location.pathname === '/' ? (
        <LoadingScreen onLoadingComplete={() => setLoading(false)} />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default HomeLayout;
