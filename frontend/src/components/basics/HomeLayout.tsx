// src/layouts/HomeLayout.tsx
import Headers from './Header';
import { Outlet } from 'react-router-dom';

const HomeLayout = () => {
  return (
    <>
      <Headers />
      <Outlet />
    </>
  );
};

export default HomeLayout;
