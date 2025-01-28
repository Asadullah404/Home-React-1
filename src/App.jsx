import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from './firebase';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";  // Ensure you're importing db correctly
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Home from "./pages/Home";
import Cal from "./pages/Cal";
import Datainc from "./pages/Datainc";
import Genpdf from "./pages/Genpdf";
import GenAllPdf from "./pages/GenAllPdf";
import HistoryAll from "./pages/HistoryAll";
import UserSearchPage from "./pages/UserSearchPage";
import History from "./pages/History";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user); // Set the user object when the user logs in

        // Fetch the user's role from Firestore
        const userRef = doc(db, "users", user.uid); // Using the user's UID to find the role
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userRole = userDoc.data().role; // Get role from Firestore
          if (userRole === "admin") {
            setIsAdmin(true); // If the user is an admin, set isAdmin to true
          } else {
            setIsAdmin(false); // Otherwise, set isAdmin to false
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar user={user} setUser={setUser} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          {/* Redirect root (/) to /home */}
          <Route path="/" element={<Navigate to="/home" />} />

          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Protected route for Admin */}
          <Route
            path="/admin-dashboard"
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/home" />}
          />

          {/* Protected route for User (accessible to both User and Admin) */}
          <Route
            path="/user-dashboard"
            element={user ? <UserDashboard user={user} /> : <Navigate to="/home" />}
          />

          {/* Public routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/Cal" element={<Cal />} />
          <Route path="/Datainc" element={<Datainc />} />
          <Route path="/Genpdf" element={<Genpdf />} />
          <Route path="/GenAllPdf" element={<GenAllPdf />} />
          <Route path="/history/:email" element={<History />} />
          <Route path="/UserSearchPage" element={<UserSearchPage />} />
          <Route path="/HistoryAll" element={<HistoryAll />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
