import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import db from your firebase.js file
import { collection, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useParams } from "react-router-dom";

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
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">History of {email}</h1>

      {/* Edit Form */}
      {editMode && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Reading</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700">Reading</label>
              <input
                type="text"
                value={editReading}
                onChange={(e) => setEditReading(e.target.value)}
                className="border px-4 py-2 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="border px-4 py-2 rounded w-full"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update Reading
            </button>
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* History Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Reading</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {historyData.length > 0 ? (
            historyData.map((reading, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{reading.reading}</td>
                <td className="px-4 py-2">
                  {/* Correctly access createdAt field */}
                  {reading.createdAt ? new Date(reading.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(reading)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reading.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center">No history available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
