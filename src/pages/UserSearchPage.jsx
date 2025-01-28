import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Import db from your firebase.js file
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserSearchPage = () => {
  const [email, setEmail] = useState(""); // Store the search term
  const [users, setUsers] = useState([]); // Store the fetched users
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(); // Fetch all users when the page loads
  }, []);

  // Fetch users from the 'users' collection
  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      let usersList = [];
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.email && data.uid) {
          usersList.push({ email: data.email, uid: data.uid });
        }
      });
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle search by email
  const handleSearch = (e) => {
    e.preventDefault();
    if (email === "") {
      fetchUsers();
    } else {
      const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const readingsQuery = query(collection(db, "readings"), where("uid", "==", uid));
      const readingsSnapshot = await getDocs(readingsQuery);

      // Delete associated readings (meters)
      readingsSnapshot.forEach((doc) => {
        deleteDoc(doc.ref); // Delete reading document
      });

      // Delete the user document
      await deleteDoc(userDocRef);
      alert("User and associated meters deleted successfully.");
      fetchUsers(); // Re-fetch the users after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  // Redirect to the history page of the selected user
  const handleRedirectToHistory = (email) => {
    navigate(`/History/${email}`); // Assuming history page route is `/HistoryAll/:email`
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Search and Manage Users</h1>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>

      {/* Users Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="border-b">
              <td
                className="px-4 py-2 cursor-pointer"
                onClick={() => handleRedirectToHistory(user.email)}
              >
                {user.email}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDeleteUser(user.uid)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserSearchPage;
