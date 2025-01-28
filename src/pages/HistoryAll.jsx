import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Ensure Firebase configuration is correctly set up and imported
import { collection, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

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
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Meter Readings History</h1>
        <p className="text-gray-600 text-lg">Track and view your meter readings by ID</p>
      </header>

      <section className="container mx-auto">
        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 text-xl">Loading meter readings...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 text-xl">{error}</p>
          </div>
        ) : Object.keys(meterReadings).length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 text-xl">No readings found for your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(meterReadings).map(([meterId, readings]) => (
              <div
                key={meterId}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                  Meter ID: <span className="text-blue-600">{meterId}</span>
                </h3>

                <ul>
                  {readings.map((reading) => (
                    <li
                      key={reading.id}
                      className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-700 font-medium">
                        Reading: <span className="font-bold">{reading.reading}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(reading.readingDate).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleEdit(reading)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReading(meterId, reading.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Reading Modal */}
      {editReading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Reading</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Reading Value</label>
              <input
                type="number"
                value={newReading.reading}
                onChange={(e) => setNewReading({ ...newReading, reading: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mt-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">Date</label>
              <input
                type="date"
                value={newReading.readingDate}
                onChange={(e) => setNewReading({ ...newReading, readingDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mt-2"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditReading(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateReading(editReading.meterId, editReading.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Electricity Meter Readings. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default History;
