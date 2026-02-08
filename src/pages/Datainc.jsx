import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase"; // Import Firestore and Auth
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { GlassCard, NeonButton } from "../components/FuturisticUI";

const AddReading = () => {
  const [meterId, setMeterId] = useState("");
  const [reading, setReading] = useState("");
  const [readingDate, setReadingDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Smart Input States
  const [existingMeters, setExistingMeters] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch existing meter IDs for suggestions
  useEffect(() => {
    const fetchUserMeters = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "readings"),
          where("uid", "==", user.uid),
          orderBy("readingDate") // Matching Cal.jsx query to ensure index compatibility
        );
        const querySnapshot = await getDocs(q);
        const metersSet = new Set();
        querySnapshot.forEach((doc) => {
          if (doc.data().meterId) metersSet.add(doc.data().meterId);
        });
        setExistingMeters([...metersSet]);
      } catch (error) {
        console.error("Error fetching user meters:", error);
      }
    };

    fetchUserMeters();

    // Click outside handler to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      // Refresh suggestions if it's a new meter
      if (!existingMeters.includes(meterId)) {
        setExistingMeters(prev => [...prev, meterId]);
      }

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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <GlassCard className="max-w-md w-full">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-8">Data Insertion</h1>
          <form onSubmit={handleAddReading} className="space-y-6">
            <div className="relative" ref={dropdownRef}>
              <label htmlFor="meterId" className="block text-sm font-medium text-gray-400 mb-2">
                Meter ID
              </label>
              <input
                type="text"
                id="meterId"
                value={meterId}
                onChange={(e) => {
                  setMeterId(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Select or Enter Meter ID"
                required
                autoComplete="off"
                className="w-full p-3 rounded-lg bg-black/50 border border-indigo-500/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              {/* Suggestions Dropdown */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-black/90 border border-indigo-500/30 rounded-lg shadow-xl max-h-60 overflow-y-auto backdrop-blur-md">
                  {existingMeters.length > 0 ? (
                    existingMeters
                      .filter(m => m.toLowerCase().includes(meterId.toLowerCase()))
                      .map((m, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setMeterId(m);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-3 text-gray-300 hover:bg-indigo-500/20 hover:text-white cursor-pointer transition-colors border-b border-gray-800 last:border-0"
                        >
                          {m}
                        </div>
                      ))
                  ) : (
                    <div className="px-4 py-3 text-gray-400 italic text-center">
                      No meters found. Type a new ID below.
                    </div>
                  )}

                  {existingMeters.length > 0 && existingMeters.filter(m => m.toLowerCase().includes(meterId.toLowerCase())).length === 0 && meterId && (
                    <div className="px-4 py-3 text-green-400 italic border-t border-gray-800">
                      Creating new Meter ID: "{meterId}"
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="reading" className="block text-sm font-medium text-gray-400 mb-2">
                Reading
              </label>
              <input
                type="number"
                id="reading"
                value={reading}
                onChange={(e) => setReading(e.target.value)}
                placeholder="Enter Reading"
                required
                className="w-full p-3 rounded-lg bg-black/50 border border-indigo-500/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label htmlFor="readingDate" className="block text-sm font-medium text-gray-400 mb-2">
                Date of Reading
              </label>
              <input
                type="date"
                id="readingDate"
                value={readingDate}
                onChange={(e) => setReadingDate(e.target.value)}
                required
                className="w-full p-3 rounded-lg bg-black/50 border border-indigo-500/30 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <NeonButton
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Submitting..." : "Submit"}
              </NeonButton>
            </div>
          </form>
          {message && (
            <div
              className={`mt-6 p-3 text-center font-bold rounded-lg ${message.includes("successfully")
                ? "text-green-400 bg-green-900/40 border border-green-500/30"
                : "text-red-400 bg-red-900/40 border border-red-500/30"
                }`}
            >
              {message}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default AddReading;
