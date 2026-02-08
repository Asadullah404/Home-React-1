import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { GlassCard, NeonButton } from "../components/FuturisticUI";
import { FileText, UserPlus, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  // Remove the '@gmail.com' from the user's email
  const userEmailWithoutDomain = user?.email?.replace("@gmail.com", "");

  return (
    <div className="min-h-screen flex flex-col items-center py-10">
      <motion.div
        className="text-center mb-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          Welcome, Admin {userEmailWithoutDomain}!
        </h1>
        <p className="text-lg text-gray-300 mt-4">Here is your admin dashboard overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {/* Generate PDF of All Users' Readings Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <FileText className="w-16 h-16 text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
          <h2 className="text-xl font-bold text-white">Generate PDF</h2>
          <p className="text-gray-400 mt-2 mb-6">Download a PDF containing all users' readings.</p>
          <Link to="/GenAllPdf" className="w-full">
            <NeonButton className="w-full">
              Generate PDF
            </NeonButton>
          </Link>
        </GlassCard>

        {/* Manage Users Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <UserPlus className="w-16 h-16 text-green-400 mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          <h2 className="text-xl font-bold text-white">Manage Users</h2>
          <p className="text-gray-400 mt-2 mb-6">Add, edit, or remove users from the system.</p>
          <Link to="/UserSearchPage" className="w-full">
            <NeonButton className="w-full !border-green-500 !text-green-400 hover:!bg-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
              Manage Users
            </NeonButton>
          </Link>
        </GlassCard>

        {/* Use AI Analytics Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <BarChart3 className="w-16 h-16 text-purple-400 mb-4 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
          <h2 className="text-xl font-bold text-white">AI Analytics</h2>
          <p className="text-gray-400 mt-2 mb-6">Analyze all readings with advanced AI tools.</p>
          <NeonButton className="w-full opacity-50 cursor-not-allowed" disabled>
            Coming Soon
          </NeonButton>
        </GlassCard>

        {/* Logout Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <LogOut className="w-16 h-16 text-red-400 mb-4 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
          <h2 className="text-xl font-bold text-white">Logout</h2>
          <p className="text-gray-400 mt-2 mb-6">Sign out of your account securely.</p>
          <NeonButton onClick={handleLogout} className="w-full !border-red-500 !text-red-400 hover:!bg-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.3)]">
            Logout
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminDashboard;
