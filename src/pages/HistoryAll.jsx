import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Ensure Firebase configuration is correctly set up and imported
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { GlassCard, NeonButton } from "../components/FuturisticUI";

const History = () => {
  const [meterReadings, setMeterReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editReading, setEditReading] = useState(null); // For editing a reading
  const [newReading, setNewReading] = useState({ reading: "", readingDate: "" });

  useEffect(() => {
    const fetchMeterReadings = async () => {
      setLoading(true);
      setError("");

      // Get the current user
      const user = auth.currentUser;

      if (!user) {
        setError("No user is logged in!");
        setLoading(false);
        return;
      }

      const uid = user.uid;

      try {
        // Query Firestore for readings where uid matches the logged-in user
        const readingsQuery = query(
          collection(db, "readings"),
          where("uid", "==", uid), // Filter by logged-in user's UID
          orderBy("meterId")
        );
        const querySnapshot = await getDocs(readingsQuery);

        const readingsByMeterId = {};

        querySnapshot.forEach((doc) => {
          const reading = doc.data();
          const { meterId } = reading;

          // Group readings by meterId
          if (!readingsByMeterId[meterId]) {
            readingsByMeterId[meterId] = [];
          }
          readingsByMeterId[meterId].push({ ...reading, id: doc.id }); // Store doc.id for later reference
        });

        setMeterReadings(readingsByMeterId);
      } catch (error) {
        console.error("Error fetching meter readings:", error);
        setError("Failed to fetch meter readings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeterReadings();
  }, []);

  // Function to handle editing a reading
  const handleEdit = (reading) => {
    setEditReading(reading);
    setNewReading({ reading: reading.reading, readingDate: reading.readingDate });
  };

  // Function to update the reading
  const handleUpdateReading = async (meterId, readingId) => {
    const readingRef = doc(db, "readings", readingId);
    try {
      await updateDoc(readingRef, {
        reading: newReading.reading,
        readingDate: newReading.readingDate,
      });
      // Refresh the page or state to reflect the updated reading
      setMeterReadings((prevReadings) => ({
        ...prevReadings,
        [meterId]: prevReadings[meterId].map((r) =>
          r.id === readingId ? { ...r, reading: newReading.reading, readingDate: newReading.readingDate } : r
        ),
      }));
      setEditReading(null); // Close the edit form
    } catch (error) {
      console.error("Error updating reading:", error);
      setError("Failed to update reading.");
    }
  };

  // Function to handle deleting a reading
  const handleDeleteReading = async (meterId, readingId) => {
    const readingRef = doc(db, "readings", readingId);
    try {
      await deleteDoc(readingRef);
      // Refresh the state to remove the deleted reading
      setMeterReadings((prevReadings) => ({
        ...prevReadings,
        [meterId]: prevReadings[meterId].filter((r) => r.id !== readingId),
      }));
    } catch (error) {
      console.error("Error deleting reading:", error);
      setError("Failed to delete reading.");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
          Meter Readings History
        </h1>
        <p className="text-gray-300 text-lg">Track and view your meter readings by ID</p>
      </header>

      <section className="container mx-auto">
        {loading ? (
          <div className="text-center">
            <p className="text-cyan-400 text-xl animate-pulse">Loading meter readings...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 text-xl bg-red-900/20 p-4 rounded-lg inline-block border border-red-500/50">{error}</p>
          </div>
        ) : Object.keys(meterReadings).length === 0 ? (
          <div className="text-center">
            <p className="text-gray-400 text-xl">No readings found for your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(meterReadings).map(([meterId, readings]) => (
              <GlassCard
                key={meterId}
                className="p-6 hover:scale-105 transition-transform duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Meter ID: <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">{meterId}</span>
                </h3>

                <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {readings.map((reading) => (
                    <li
                      key={reading.id}
                      className="p-3 bg-black/40 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors"
                    >
                      <p className="text-gray-300 font-medium">
                        Reading: <span className="font-bold text-white">{reading.reading}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(reading.readingDate).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between mt-3 pt-2 border-t border-gray-700/50">
                        <button
                          onClick={() => handleEdit(reading)}
                          className="text-cyan-500 hover:text-cyan-300 transition-colors text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReading(meterId, reading.id)}
                          className="text-red-500 hover:text-red-300 transition-colors text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Edit Reading Modal */}
      {editReading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <GlassCard className="w-full max-w-md p-8 relative">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-6">Edit Reading</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Reading Value</label>
              <input
                type="number"
                value={newReading.reading}
                onChange={(e) => setNewReading({ ...newReading, reading: e.target.value })}
                className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={newReading.readingDate}
                onChange={(e) => setNewReading({ ...newReading, readingDate: e.target.value })}
                className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditReading(null)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <NeonButton
                onClick={() => handleUpdateReading(editReading.meterId, editReading.id)}
                className="px-6"
              >
                Save Changes
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}

      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} <span className="text-cyan-800">Electricity Meter Readings</span>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default History;
