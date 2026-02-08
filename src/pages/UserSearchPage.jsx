import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { GlassCard, NeonButton } from "../components/FuturisticUI";

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
    <div className="container mx-auto p-6 flex justify-center">
      <GlassCard className="max-w-2xl w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-8">
          Search and Manage Users
        </h1>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          <NeonButton
            type="submit"
            className="w-full sm:w-auto"
          >
            Search
          </NeonButton>
        </form>

        {/* Users Table (Responsive) */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-cyan-400">Email</th>
                <th className="px-4 py-3 text-cyan-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td
                    className="px-4 py-3 cursor-pointer text-blue-400 hover:text-blue-300 hover:underline"
                    onClick={() => handleRedirectToHistory(user.email)}
                  >
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteUser(user.uid)}
                      className="text-red-400 hover:text-red-300 transition-colors font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default UserSearchPage;
