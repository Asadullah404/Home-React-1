
import React, { useState } from "react";
import { auth, db } from "../firebase"; // Import Firestore and Auth
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddReading = () => {
  const [meterId, setMeterId] = useState("");
  const [reading, setReading] = useState("");
  const [readingDate, setReadingDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddReading = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    setMessage(""); // Reset message state

    // Get the current logged-in user
    const user = auth.currentUser;

    if (!user) {
      setMessage("Error: No user is logged in.");
      setLoading(false);
      return;
    }

    const uid = user.uid;

    try {
      // Prepare data for Firestore
      const readingData = {
        uid, // User's UID
        meterId,
        reading: parseFloat(reading), // Ensure reading is stored as a number
        readingDate,
        createdAt: serverTimestamp(), // Firestore server timestamp
      };

      // Save to Firestore
      await addDoc(collection(db, "readings"), readingData);

      // Reset form fields
      setMeterId("");
      setReading("");
      setReadingDate("");

      // Provide feedback to the user
      setMessage("Reading added successfully!");
    } catch (error) {
      console.error("Error adding reading:", error);
      setMessage("Failed to add reading. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Data Insertion</h1>
            <form onSubmit={handleAddReading} className="space-y-6">
              <div>
                <label htmlFor="meterId" className="block text-sm font-medium text-gray-700">
                  Meter ID
                </label>
                <input
                  type="text"
                  id="meterId"
                  value={meterId}
                  onChange={(e) => setMeterId(e.target.value)}
                  placeholder="Enter Meter ID"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="reading" className="block text-sm font-medium text-gray-700">
                  Reading
                </label>
                <input
                  type="number"
                  id="reading"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  placeholder="Enter Reading"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="readingDate" className="block text-sm font-medium text-gray-700">
                  Date of Reading
                </label>
                <input
                  type="date"
                  id="readingDate"
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
            {message && (
              <div
                className={`mt-4 p-2 text-center font-medium rounded-md ${
                  message.includes("successfully")
                    ? "text-green-800 bg-green-200"
                    : "text-red-800 bg-red-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReading;
