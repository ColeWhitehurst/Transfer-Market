import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;