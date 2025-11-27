import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import LandingPage from "./Components/LandingPage/LandingPage";
import AdminLogin from "./Components/AdminLogin/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import Books from "./Components/Books/Books";
import AddBook from "./Components/AddBook/AddBook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/books" element={<Books />} />
        <Route path="/admin/add-book" element={<AddBook />} />
        {/* Add more routes as needed */}
        <Route />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
