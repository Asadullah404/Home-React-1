import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { FileText, Calculator, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const userName = "John Doe";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <motion.div
        className="text-center mb-8 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {userName}!</h1>
        <p className="text-lg text-gray-600 mt-2">Here is your dashboard overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {/* Generate PDF Section */}
        <Card>
          <CardContent>
            <FileText className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">Generate PDF of All Previous Readings</h2>
            <p className="text-gray-600 text-center mt-2">Download a PDF containing all your previous readings.</p>
            <Link
              to="/Genpdf"
              className="block px-4 py-2 rounded-lg text-center bg-blue-600 text-white hover:bg-blue-700 transition mt-4"
            >
              Generate PDF
            </Link>
          </CardContent>
        </Card>

        {/* Calculate Readings Section */}
        <Card>
          <CardContent>
            <Calculator className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">Calculate the Readings</h2>
            <p className="text-gray-600 text-center mt-2">Perform calculations on your meter readings.</p>
            <Link
              to="/Cal"
              className="block px-4 py-2 rounded-lg text-center bg-green-600 text-white hover:bg-green-700 transition mt-4"
            >
              Calculate Readings
            </Link>
          </CardContent>
        </Card>

        {/* Use AI Analytics Section */}
        <Card>
          <CardContent>
            <BarChart3 className="w-12 h-12 text-purple-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">Use AI Analytics in Your Reading</h2>
            <p className="text-gray-600 text-center mt-2">Analyze your readings with advanced AI tools.</p>
            <Button className="mt-4 w-full" variant="default" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card>
          <CardContent>
            <LogOut className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 text-center">Logout</h2>
            <p className="text-gray-600 text-center mt-2">Sign out of your account securely.</p>
            <Button className="mt-4 w-full" variant="default">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
