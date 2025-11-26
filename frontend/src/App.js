import { BrowserRouter,  Routes, Route} from 'react-router-dom';
import LoginRegister from './Components/LoginRegister/LoginRegister';

//dashboard imports
import DashboardLayout from './Components/logout/DashboardLayout';
import Dashboard from './Components/pages/userDashboard/userDashboard';
import Books from './Components/pages/books/book.jsx';
import Profile from './Components/pages/profile/profile.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========= AUTH ROUTE ========= */}
        <Route path="/" element={<LoginRegister />} />

        {/* ========= USER DASHBOARD ROUTES ========= */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/books"
          element={
            <DashboardLayout>
              <Books />
            </DashboardLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;