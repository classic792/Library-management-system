import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Library LMS</h2>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/books">Books</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
