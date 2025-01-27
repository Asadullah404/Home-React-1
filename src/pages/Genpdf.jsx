import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { db } from '../firebase'; // Import db from your firebase.js file
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const GenPDF = () => {
  const [meterIds, setMeterIds] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedMeterIds, setSelectedMeterIds] = useState([]);

  useEffect(() => {
    fetchMeterIds();
  }, []);

  // Fetch meter IDs from Firestore
  const fetchMeterIds = async () => {
    const readingsRef = collection(db, 'readings');
    const readingsSnapshot = await getDocs(readingsRef);
    let meterIdsSet = new Set();
    readingsSnapshot.forEach((doc) => {
      meterIdsSet.add(doc.data().meterId);
    });
    setMeterIds([...meterIdsSet]);
  };

  // Generate PDF
 // Generate PDF
 const generatePDF = async (e) => {
  e.preventDefault();

  if (!fromDate || !toDate || selectedMeterIds.length === 0) {
    alert("Please select meter IDs and dates.");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const logo = 'public/logo.PNG'; // Path to your logo

  let y = 50; // Starting y-coordinate after logo

  // Function to add the logo on every page
  const addHeaderLogo = () => {
    doc.addImage(logo, 'PNG', pageWidth / 2 - 25, 10, 50, 30); // Center logo (50x30)
  };

  // Add logo to the first page
  addHeaderLogo();

  const readingsRef = collection(db, 'readings');
  const q = query(
    readingsRef,
    where('meterId', 'in', selectedMeterIds)
  );
  const querySnapshot = await getDocs(q);
  let readingsByMeter = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (!readingsByMeter[data.meterId]) {
      readingsByMeter[data.meterId] = [];
    }
    readingsByMeter[data.meterId].push(data);
  });

  Object.keys(readingsByMeter).forEach((meterId) => {
    if (y + 20 > pageHeight - 20) {
      doc.addPage();
      addHeaderLogo(); // Add logo to the new page
      y = 50; // Reset y-coordinate for the new page
    }
    doc.text(`Meter ID: ${meterId}`, 20, y);
    y += 10;

    let tableData = readingsByMeter[meterId]
      .filter((reading) => {
        const readingDate = new Date(reading.readingDate);
        return (
          readingDate >= new Date(fromDate) && readingDate <= new Date(toDate)
        );
      })
      .map((reading) => {
        let readingDate = new Date(reading.readingDate);
        return [readingDate.toDateString(), reading.reading];
      });

    if (tableData.length === 0) {
      doc.text("No readings available for the selected date range.", 20, y);
      y += 10;
    } else {
      doc.autoTable({
        head: [['Date', 'Reading']],
        body: tableData,
        startY: y,
        theme: 'striped',
      });
      y = doc.autoTable.previous.finalY + 10;
    }
  });

  doc.save('readings_report.pdf');
};


  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Generate PDF of History Readings</h1>
      <form onSubmit={generatePDF} className="space-y-4">
        <div>
          <label htmlFor="pdfMeterIds" className="block text-gray-700 font-medium">Meter IDs:</label>
          <select
            id="pdfMeterIds"
            multiple
            value={selectedMeterIds}
            onChange={(e) => setSelectedMeterIds(Array.from(e.target.selectedOptions, option => option.value))}
            required
            className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {meterIds.map((meterId) => (
              <option key={meterId} value={meterId}>{meterId}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pdfFromDate" className="block text-gray-700 font-medium">From Date:</label>
          <input
            type="date"
            id="pdfFromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
            className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="pdfToDate" className="block text-gray-700 font-medium">To Date:</label>
          <input
            type="date"
            id="pdfToDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
            className="mt-2 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default GenPDF;
