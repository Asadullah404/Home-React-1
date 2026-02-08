import React from "react";
import { auth } from "../firebase";
import { GlassCard, NeonButton } from "../components/FuturisticUI";
import { FileText, Calculator, BarChart3, History } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const user = auth.currentUser;

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
          Welcome, {userEmailWithoutDomain}!
        </h1>
        <p className="text-lg text-gray-300 mt-4">Here is your dashboard overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {/* Generate PDF Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <FileText className="w-16 h-16 text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
          <h2 className="text-xl font-bold text-white">Generate PDF</h2>
          <p className="text-gray-400 mt-2 mb-6">Download a PDF containing all your previous readings.</p>
          <Link to="/Genpdf" className="w-full">
            <NeonButton className="w-full">
              Generate PDF
            </NeonButton>
          </Link>
        </GlassCard>

        {/* Calculate Readings Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <Calculator className="w-16 h-16 text-green-400 mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          <h2 className="text-xl font-bold text-white">Calculate Readings</h2>
          <p className="text-gray-400 mt-2 mb-6">Perform calculations on your meter readings.</p>
          <Link to="/Cal" className="w-full">
            <NeonButton className="w-full !border-green-500 !text-green-400 hover:!bg-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.3)]">
              Calculate
            </NeonButton>
          </Link>
        </GlassCard>

        {/* Use AI Analytics Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <BarChart3 className="w-16 h-16 text-purple-400 mb-4 drop-shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
          <h2 className="text-xl font-bold text-white">AI Analytics</h2>
          <p className="text-gray-400 mt-2 mb-6">Analyze your readings with advanced AI tools.</p>
          <NeonButton className="w-full opacity-50 cursor-not-allowed" disabled>
            Coming Soon
          </NeonButton>
        </GlassCard>

        {/* History Section */}
        <GlassCard className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <History className="w-16 h-16 text-indigo-400 mb-4 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" />
          <h2 className="text-xl font-bold text-white">View History</h2>
          <p className="text-gray-400 mt-2 mb-6">Check the history of your readings.</p>
          <Link to="/historyAll" className="w-full">
            <NeonButton className="w-full !border-indigo-500 !text-indigo-400 hover:!bg-indigo-500/20 shadow-[0_0_10px_rgba(129,140,248,0.3)]">
              View History
            </NeonButton>
          </Link>
        </GlassCard>
      </div>
    </div>
  );
};

export default UserDashboard;
