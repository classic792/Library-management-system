import Navbar from "../Navbar/navbar.jsx";
import Sidebar from "../Sidebar/sidebar.jsx";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-content">
        <Navbar />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
