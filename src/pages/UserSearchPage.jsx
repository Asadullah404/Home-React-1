import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserSearchPage = () => {
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleDeleteUser = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const readingsQuery = query(collection(db, "readings"), where("uid", "==", uid));
      const readingsSnapshot = await getDocs(readingsQuery);

      readingsSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });

      await deleteDoc(userDocRef);
      alert("User and associated meters deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleRedirectToHistory = (email) => {
    navigate(`/History/${email}`);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-4">
        Search and Manage Users
      </h1>

      {/* Search Box */}
      <form onSubmit={handleSearch} className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {/* Users Table (Responsive) */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left border border-gray-200">Email</th>
              <th className="px-4 py-2 text-left border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid} className="border-b">
                <td
                  className="px-4 py-2 cursor-pointer text-blue-600 hover:underline"
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
    </div>
  );
};

export default UserSearchPage;
