import { Outlet } from "react-router-dom";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "80vh" }}>
        <Outlet /> {/* This renders child pages */}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
