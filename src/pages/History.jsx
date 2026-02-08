import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import db from your firebase.js file
import { collection, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { GlassCard, NeonButton } from "../components/FuturisticUI";

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editReading, setEditReading] = useState(null);
  const [editDate, setEditDate] = useState("");
  const { email } = useParams(); // Get the email from the URL params
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    fetchUserUid(); // Fetch the user UID based on email
  }, [email]);

  const fetchUserUid = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      let foundUserUid = null;

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email === email) {
          foundUserUid = data.uid;
        }
      });

      if (foundUserUid) {
        setUserUid(foundUserUid);
        fetchHistoryData(foundUserUid); // Fetch history data once the UID is found
      } else {
        console.log("No user found with the email:", email);
      }
    } catch (error) {
      console.error("Error fetching user UID:", error);
    }
  };

  const fetchHistoryData = async (uid) => {
    try {
      console.log("Fetching history data for UID:", uid); // Debugging log
      const readingsQuery = query(collection(db, "readings"), where("uid", "==", uid)); // Query using uid
      const readingsSnapshot = await getDocs(readingsQuery);

      let historyList = [];
      readingsSnapshot.forEach((doc) => {
        console.log("Found reading:", doc.data()); // Debugging log
        historyList.push({ id: doc.id, ...doc.data() });
      });

      setHistoryData(historyList);

      if (historyList.length === 0) {
        console.log("No history found for UID:", uid); // Debugging log for no data
      }
    } catch (error) {
      console.error("Error fetching history data:", error);
    }
  };

  const handleEdit = (reading) => {
    setEditMode(true);
    setEditReading(reading.reading);
    setEditDate(reading.readingDate);
  };

  const handleUpdate = async () => {
    try {
      if (editReading && editDate) {
        const readingRef = doc(db, "readings", editReading.id); // Get the document reference
        await updateDoc(readingRef, {
          reading: editReading,
          readingDate: editDate,
        });
        fetchHistoryData(userUid); // Fetch updated data
        setEditMode(false); // Close edit mode
      }
    } catch (error) {
      console.error("Error updating reading:", error);
    }
  };

  const handleDelete = async (readingId) => {
    try {
      const readingRef = doc(db, "readings", readingId);
      await deleteDoc(readingRef);
      fetchHistoryData(userUid); // Fetch updated data
    } catch (error) {
      console.error("Error deleting reading:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <GlassCard className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">History of {email}</h1>

        {/* Edit Form */}
        {editMode && (
          <div className="mb-8 p-4 bg-black/50 border border-cyan-500/30 rounded-xl">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Edit Reading</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-300">Reading</label>
                <input
                  type="text"
                  value={editReading}
                  onChange={(e) => setEditReading(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-gray-300">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-4">
                <NeonButton type="submit">
                  Update Reading
                </NeonButton>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-2 rounded-full font-bold text-white border border-gray-500/50 hover:bg-gray-500/20 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-cyan-400">Reading</th>
                <th className="px-4 py-3 text-cyan-400">Date</th>
                <th className="px-4 py-3 text-cyan-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyData.length > 0 ? (
                historyData.map((reading, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-gray-300">{reading.reading}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {/* Correctly access createdAt field */}
                      {reading.createdAt ? new Date(reading.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(reading)}
                        className="px-4 py-1 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-500/30 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(reading.id)}
                        className="px-4 py-1 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-gray-400">No history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default History;
