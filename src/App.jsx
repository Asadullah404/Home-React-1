import './App.css';
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Home1 from "./pages/Home1";
import Cal from "./pages/Cal";
import Datainc from "./pages/Datainc";
import Genpdf from "./pages/Genpdf";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  // State to track the logged-in user
  const [user, setUser] = useState(null); // `user` will hold user info like username, email, etc.

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar user={user} setUser={setUser} />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={<Login setUser={setUser} />} // Pass `setUser` to Login
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/user-dashboard"
            element={<UserDashboard user={user} />} // Pass `user` to UserDashboard
          />
          <Route path="/home1" element={<Home1 />} />
          <Route path="/Cal" element={<Cal />} />
          <Route path="/Datainc" element={<Datainc />} />
          <Route path="/Genpdf" element={<Genpdf />} />
          <Route path="/History" element={<History />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
