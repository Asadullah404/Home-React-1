import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { db } from "../firebase"; // Import db from your firebase.js file
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const GeneratePdfPage = () => {
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      const usersList = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const generatePDF = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || selectedUsers.length === 0) {
      alert("Please select users and specify a date range.");
      return;
    }

    setLoading(true);

    try {
      const doc = new jsPDF({ orientation: "landscape" });
      const logo = "/vite.PNG"; // Path to your logo
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      doc.addImage(logo, "PNG", pageWidth / 2 - 20, 10, 40, 20);
      doc.setFontSize(18);
      doc.text("Users Readings Report", pageWidth / 2, 40, { align: "center" });
      doc.setFontSize(12);
      doc.text(`From: ${fromDate}  To: ${toDate}`, 10, 50);

      const readingsRef = collection(db, "readings");

      for (const user of selectedUsers) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text(`User: ${user.email}`, 10, 20);

        const readingsQuery = query(
          readingsRef,
          where("uid", "==", user.uid),
          orderBy("readingDate", "asc")
        );
        const querySnapshot = await getDocs(readingsQuery);

        const readings = querySnapshot.docs
          .map(doc => doc.data())
          .filter(data => {
            const readingDate = new Date(data.readingDate);
            return readingDate >= new Date(fromDate) && readingDate <= new Date(toDate);
          });

        if (readings.length === 0) {
          doc.setFontSize(12);
          doc.text("No readings available for the selected date range.", 10, 30);
        } else {
          const tableData = readings.map((reading, index) => [
            index + 1,
            reading.meterId,
            reading.reading,
            new Date(reading.readingDate).toLocaleDateString(),
          ]);

          doc.autoTable({
            head: [["#", "Meter ID", "Reading", "Date"]],
            body: tableData,
            startY: 30,
            styles: { fontSize: 10, halign: "center" },
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          });
        }
      }

      doc.save(`Readings_Report_All_Users.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-md">
      <h1 className="text-2xl font-bold text-gray-700 mb-4">Generate Users Readings PDF</h1>
      <form onSubmit={generatePDF} className="space-y-6">
        <div>
          <label htmlFor="users" className="block text-sm font-medium text-gray-700">
            Select Users
          </label>
          <select
            id="users"
            multiple
            value={selectedUsers.map(user => user.uid)}
            onChange={(e) =>
              setSelectedUsers(
                Array.from(e.target.selectedOptions, option =>
                  users.find(user => user.uid === option.value)
                )
              )
            }
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {users.map(user => (
              <option key={user.uid} value={user.uid}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex-1">
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? "Generating..." : "Generate PDF"}
        </button>
      </form>
    </div>
  );
};

export default GeneratePdfPage;


