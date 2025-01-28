// import React, { useState, useEffect } from "react";
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";
// import { db } from "../firebase"; // Import db from your firebase.js file
// import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
// import { getAuth } from "firebase/auth"; // To access authentication

// const GenPDF = () => {
//   const [meterIds, setMeterIds] = useState([]);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [selectedMeterIds, setSelectedMeterIds] = useState([]);

//   useEffect(() => {
//     fetchMeterIds();
//   }, []);

//   // Fetch meter IDs for the current user from Firestore
//   const fetchMeterIds = async () => {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       const readingsRef = collection(db, "readings");
//       const q = query(
//         readingsRef,
//         where("uid", "==", user.uid), // Filter by user ID
//         orderBy("meterId", "asc") // Use indexed order
//       );
//       const readingsSnapshot = await getDocs(q);
//       let meterIdsSet = new Set();

//       readingsSnapshot.forEach((doc) => {
//         meterIdsSet.add(doc.data().meterId); // Add unique meterId for the current user
//       });
//       setMeterIds([...meterIdsSet]);
//     } else {
//       console.error("No user is logged in.");
//     }
//   };

//   // Generate PDF
//   const generatePDF = async (e) => {
//     e.preventDefault();

//     if (!fromDate || !toDate || selectedMeterIds.length === 0) {
//       alert("Please select meter IDs and dates.");
//       return;
//     }

//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.width;
//     const pageHeight = doc.internal.pageSize.height;
//     const logo = "/vite.PNG"; // Path to your logo

//     let y = 50; // Starting y-coordinate after logo

//     // Function to add the logo on every page
//     const addHeaderLogo = () => {
//       doc.addImage(logo, "PNG", pageWidth / 2 - 25, 10, 50, 30); // Center logo (50x30)
//     };

//     // Add logo to the first page
//     addHeaderLogo();

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       const readingsRef = collection(db, "readings");
//       const q = query(
//         readingsRef,
//         where("uid", "==", user.uid), // Filter by user ID
//         where("meterId", "in", selectedMeterIds), // Filter by selected meter IDs
//         orderBy("meterId", "asc"), // Match index
//         orderBy("readingDate", "asc") // Match index
//       );
//       const querySnapshot = await getDocs(q);

//       let readingsByMeter = {};

//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         const readingDate = new Date(data.readingDate);

//         // Only include readings within the selected date range
//         if (
//           readingDate >= new Date(fromDate) &&
//           readingDate <= new Date(toDate)
//         ) {
//           if (!readingsByMeter[data.meterId]) {
//             readingsByMeter[data.meterId] = [];
//           }
//           readingsByMeter[data.meterId].push({
//             date: readingDate.toDateString(),
//             reading: data.reading,
//           });
//         }
//       });

//       // Generate the PDF with readings
//       Object.keys(readingsByMeter).forEach((meterId) => {
//         if (y + 20 > pageHeight - 20) {
//           doc.addPage();
//           addHeaderLogo(); // Add logo to the new page
//           y = 50; // Reset y-coordinate for the new page
//         }
//         doc.text(`Meter ID: ${meterId}`, 20, y);
//         y += 10;

//         const tableData = readingsByMeter[meterId].map((entry) => [
//           entry.date,
//           entry.reading,
//         ]);

//         if (tableData.length === 0) {
//           doc.text(
//             "No readings available for the selected date range.",
//             20,
//             y
//           );
//           y += 10;
//         } else {
//           doc.autoTable({
//             head: [["Date", "Reading"]],
//             body: tableData,
//             startY: y,
//             theme: "striped",
//           });
//           y = doc.autoTable.previous.finalY + 10;
//         }
//       });

//       doc.save("readings_report.pdf");
//     } else {
//       console.error("No user is logged in.");
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
//       <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Generate PDF of History Readings</h1>
//       <form onSubmit={generatePDF} className="space-y-4">
//         <div>
//           <label htmlFor="pdfMeterIds" className="block text-gray-700 font-medium">Meter IDs:</label>
//           <select
//             id="pdfMeterIds"
//             multiple
//             value={selectedMeterIds}
//             onChange={(e) =>
//               setSelectedMeterIds(
//                 Array.from(e.target.selectedOptions, (option) => option.value)
//               )
//             }
//             required
//             className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {meterIds.map((meterId) => (
//               <option key={meterId} value={meterId}>
//                 {meterId}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="pdfFromDate" className="block text-gray-700 font-medium">From Date:</label>
//           <input
//             type="date"
//             id="pdfFromDate"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             required
//             className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label htmlFor="pdfToDate" className="block text-gray-700 font-medium">To Date:</label>
//           <input
//             type="date"
//             id="pdfToDate"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             required
//             className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div className="text-center">
//           <button
//             type="submit"
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Generate PDF
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default GenPDF;




import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { db } from "../firebase"; // Import db from your firebase.js file
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // To access authentication

const GenPDF = () => {
  const [meterIds, setMeterIds] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMeterIds, setSelectedMeterIds] = useState([]);

  useEffect(() => {
    fetchMeterIds();
  }, []);

  const fetchMeterIds = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const readingsRef = collection(db, "readings");
      const q = query(
        readingsRef,
        where("uid", "==", user.uid),
        orderBy("meterId", "asc")
      );
      const readingsSnapshot = await getDocs(q);
      let meterIdsSet = new Set();

      readingsSnapshot.forEach((doc) => {
        meterIdsSet.add(doc.data().meterId);
      });
      setMeterIds([...meterIdsSet]);
    } else {
      console.error("No user is logged in.");
    }
  };

  const generatePDF = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || selectedMeterIds.length === 0) {
      alert("Please select meter IDs and dates.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const logo = "/vite.PNG";

    let y = 50;

    const addHeaderLogo = () => {
      doc.addImage(logo, "PNG", pageWidth / 2 - 25, 10, 50, 30);
    };

    addHeaderLogo();

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const readingsRef = collection(db, "readings");
      const q = query(
        readingsRef,
        where("uid", "==", user.uid),
        where("meterId", "in", selectedMeterIds),
        orderBy("meterId", "asc"),
        orderBy("readingDate", "asc")
      );
      const querySnapshot = await getDocs(q);

      let readingsByMeter = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const readingDate = new Date(data.readingDate);

        if (
          readingDate >= new Date(fromDate) &&
          readingDate <= new Date(toDate)
        ) {
          if (!readingsByMeter[data.meterId]) {
            readingsByMeter[data.meterId] = [];
          }
          readingsByMeter[data.meterId].push({
            date: readingDate.toDateString(),
            reading: data.reading,
          });
        }
      });

      Object.keys(readingsByMeter).forEach((meterId) => {
        if (y + 20 > pageHeight - 20) {
          doc.addPage();
          addHeaderLogo();
          y = 50;
        }
        doc.text(`Meter ID: ${meterId}`, 20, y);
        y += 10;

        const tableData = readingsByMeter[meterId].map((entry) => [
          entry.date,
          entry.reading,
        ]);

        if (tableData.length === 0) {
          doc.text(
            "No readings available for the selected date range.",
            20,
            y
          );
          y += 10;
        } else {
          doc.autoTable({
            head: [["Date", "Reading"]],
            body: tableData,
            startY: y,
            theme: "striped",
          });
          y = doc.autoTable.previous.finalY + 10;
        }
      });

      doc.save("readings_report.pdf");
    } else {
      console.error("No user is logged in.");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-xl rounded-lg max-w-2xl">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Generate Readings PDF</h1>
      <form onSubmit={generatePDF} className="space-y-6">
        <div>
          <label
            htmlFor="pdfMeterIds"
            className="block text-lg text-gray-700 font-semibold"
          >
            Select Meter IDs:
          </label>
          <select
            id="pdfMeterIds"
            multiple
            value={selectedMeterIds}
            onChange={(e) =>
              setSelectedMeterIds(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {meterIds.map((meterId) => (
              <option key={meterId} value={meterId}>
                {meterId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="pdfFromDate"
            className="block text-lg text-gray-700 font-semibold"
          >
            From Date:
          </label>
          <input
            type="date"
            id="pdfFromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="pdfToDate"
            className="block text-lg text-gray-700 font-semibold"
          >
            To Date:
          </label>
          <input
            type="date"
            id="pdfToDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenPDF;
