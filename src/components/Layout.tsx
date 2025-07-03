import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
