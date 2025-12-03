import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegister from "./Components/LoginRegister/LoginRegister";
import LandingPage from "./Components/LandingPage/LandingPage";
import AdminLogin from "./Components/AdminLogin/AdminLogin";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import Books from "./Components/Books/Books";
import AddBook from "./Components/AddBook/AddBook";
import UserDashboard from "./Components/userDashboard/userDashboard";
import AvailableBooks from "./Components/availableBooks/availableBooks";
import BorrowHistory from "./Components/borrowHistory/history";
import ProtectedRoute from "./protectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/books" element={<Books />} />
        <Route path="/admin/add-book" element={<AddBook />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/available-books"
          element={
            <ProtectedRoute>
              <AvailableBooks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/borrow-history"
          element={
            <ProtectedRoute>
              <BorrowHistory />
            </ProtectedRoute>
          }
        />
        {/* Add more routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
