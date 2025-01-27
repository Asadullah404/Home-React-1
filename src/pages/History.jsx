// import React, { useEffect, useState } from "react";
// import { db } from "../firebase"; // Ensure your Firebase configuration is correctly set up and imported
// import { collection, query, orderBy, getDocs } from "firebase/firestore";

// const History = () => {
//   const [meterReadings, setMeterReadings] = useState([]);

//   useEffect(() => {
//     const fetchMeterReadings = async () => {
//       try {
//         const readingsQuery = query(
//           collection(db, "readings"),
//           orderBy("meterId")
//         );
//         const querySnapshot = await getDocs(readingsQuery);

//         const readingsByMeterId = {};

//         querySnapshot.forEach((doc) => {
//           const reading = doc.data();
//           const { meterId } = reading;

//           // Group readings by meterId
//           if (!readingsByMeterId[meterId]) {
//             readingsByMeterId[meterId] = [];
//           }
//           readingsByMeterId[meterId].push(reading);
//         });

//         setMeterReadings(readingsByMeterId);
//       } catch (error) {
//         console.error("Error fetching meter readings:", error);
//       }
//     };

//     fetchMeterReadings();
//   }, []);

//   return (
//     <div className="p-6">
     

//       <section>
//         <h2 className="text-2xl font-semibold mb-4">History</h2>

//         {Object.keys(meterReadings).length === 0 ? (
//           <p className="text-gray-600">Loading meter readings...</p>
//         ) : (
//           <div>
//             {Object.entries(meterReadings).map(([meterId, readings]) => (
//               <div key={meterId} className="mb-6 border p-4 rounded-lg shadow-sm">
//                 <h3 className="text-xl font-bold text-gray-700 mb-2">Meter ID: {meterId}</h3>

//                 {readings.map((reading, index) => (
//                   <div key={index} className="mb-4">
//                     <p className="text-gray-800">Reading: {reading.reading}</p>
//                     <p className="text-gray-600">Date: {reading.readingDate}</p>
//                     <hr className="my-2 border-gray-300" />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <footer className="mt-10 text-center text-gray-500">
//         <p>&copy; 2024 Electricity Meter Readings. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default History;


import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Ensure your Firebase configuration is correctly set up and imported
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const History = () => {
  const [meterReadings, setMeterReadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeterReadings = async () => {
      try {
        const readingsQuery = query(
          collection(db, "readings"),
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
          readingsByMeterId[meterId].push(reading);
        });

        setMeterReadings(readingsByMeterId);
      } catch (error) {
        console.error("Error fetching meter readings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeterReadings();
  }, []);

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
        ) : Object.keys(meterReadings).length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 text-xl">No readings found.</p>
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
                  {readings.map((reading, index) => (
                    <li
                      key={index}
                      className="mb-4 last:mb-0 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-700 font-medium">
                        Reading: <span className="font-bold">{reading.reading}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(reading.readingDate).toLocaleDateString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-16 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Electricity Meter Readings. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default History;
