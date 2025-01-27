import React, { useState } from "react";
import { db } from "../firebase"; // Ensure your Firebase config is properly imported
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const Cal = () => {
  const [searchMeterId, setSearchMeterId] = useState("");
  const [readings, setReadings] = useState([]);
  const [fromReading, setFromReading] = useState("");
  const [toReading, setToReading] = useState("");
  const [dateRangeResult, setDateRangeResult] = useState("");
  const [prevReading, setPrevReading] = useState("");
  const [currReading, setCurrReading] = useState("");
  const [readingPeriod, setReadingPeriod] = useState("Inst");
  const [unitsResult, setUnitsResult] = useState("");
  const [watts, setWatts] = useState("");
  const [hours, setHours] = useState("");
  const [wattHourResult, setWattHourResult] = useState("");

  // Fetch readings for a given meter ID
  const fetchReadings = async (e) => {
    e.preventDefault();
    setDateRangeResult("");

    try {
      const q = query(
        collection(db, "readings"),
        where("meterId", "==", searchMeterId),
        orderBy("readingDate")
      );
      const querySnapshot = await getDocs(q);
      const fetchedReadings = [];
      querySnapshot.forEach((doc) => fetchedReadings.push(doc.data()));

      setReadings(fetchedReadings);

      if (fetchedReadings.length < 2) {
        setDateRangeResult("Not enough data to calculate units used.");
        return;
      }
    } catch (error) {
      console.error("Error fetching readings:", error);
      setDateRangeResult("Error fetching readings. Please try again later.");
    }
  };

  // Calculate units used within a date range
  const calculateUnitsUsedFromDateRange = (e) => {
    e.preventDefault();

    const fromValue = parseFloat(fromReading);
    const toValue = parseFloat(toReading);

    if (toValue <= fromValue) {
      setDateRangeResult("To reading must be greater than from reading.");
      return;
    }

    const unitsUsed = toValue - fromValue;
    setDateRangeResult(`Units used: ${unitsUsed}`);
  };

  // Calculate units per day, week, or month
  const calculateUnits = (e) => {
    e.preventDefault();

    const prevValue = parseFloat(prevReading);
    const currValue = parseFloat(currReading);

    if (currValue <= prevValue) {
      setUnitsResult("Current reading must be greater than previous reading.");
      return;
    }

    const unitsUsed = currValue - prevValue;
    let unitsPerPeriod = 0;

    switch (readingPeriod) {
      case "Inst":
        unitsPerPeriod = unitsUsed;
        break;
      case "week":
        unitsPerPeriod = unitsUsed / 7;
        break;
      case "month":
        unitsPerPeriod = unitsUsed / 30;
        break;
      default:
        break;
    }

    setUnitsResult(
      `Units consumed per ${readingPeriod}: ${unitsPerPeriod.toFixed(2)}`
    );
  };

  // Calculate units by watt-hour
  const calculateUnitsByWattHour = (e) => {
    e.preventDefault();

    const wattValue = parseFloat(watts);
    const hourValue = parseFloat(hours);

    const unitsUsed = (wattValue * hourValue) / 1000; // Convert watt-hours to kWh
    setWattHourResult(`Units consumed: ${unitsUsed.toFixed(2)} kWh`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Calculation Dashboard</h1>

        {/* Fetch Readings Form */}
        <form onSubmit={fetchReadings} className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700">Units Used from Date to Date</h2>
          <div>
            <label htmlFor="searchMeterId" className="block text-lg font-medium text-gray-600">
              Meter ID:
            </label>
            <input
              type="text"
              id="searchMeterId"
              value={searchMeterId}
              onChange={(e) => setSearchMeterId(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </form>

        {readings.length > 0 && (
          <form onSubmit={calculateUnitsUsedFromDateRange} className="space-y-6 mt-6">
            <div>
              <label htmlFor="fromReading" className="block text-lg font-medium text-gray-600">
                From:
              </label>
              <select
                id="fromReading"
                value={fromReading}
                onChange={(e) => setFromReading(e.target.value)}
                required
                className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {readings.map((reading, index) => (
                  <option key={index} value={reading.reading}>
                    {reading.readingDate}: {reading.reading}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="toReading" className="block text-lg font-medium text-gray-600">
                To:
              </label>
              <select
                id="toReading"
                value={toReading}
                onChange={(e) => setToReading(e.target.value)}
                required
                className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {readings.map((reading, index) => (
                  <option key={index} value={reading.reading}>
                    {reading.readingDate}: {reading.reading}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition duration-300"
            >
              Calculate
            </button>
          </form>
        )}
        {dateRangeResult && (
          <p className="text-lg text-green-600 mt-4 text-center">{dateRangeResult}</p>
        )}

        {/* Units Consumption Form */}
        <form onSubmit={calculateUnits} className="space-y-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-700">Units Consumption Per Day & Total Units</h2>
          <div>
            <label htmlFor="prevReading" className="block text-lg font-medium text-gray-600">
              Previous Reading:
            </label>
            <input
              type="number"
              id="prevReading"
              value={prevReading}
              onChange={(e) => setPrevReading(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="currReading" className="block text-lg font-medium text-gray-600">
              Current Reading:
            </label>
            <input
              type="number"
              id="currReading"
              value={currReading}
              onChange={(e) => setCurrReading(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="readingPeriod" className="block text-lg font-medium text-gray-600">
              Reading Period:
            </label>
            <select
              id="readingPeriod"
              value={readingPeriod}
              onChange={(e) => setReadingPeriod(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Inst">Instant</option>
              <option value="week">Week</option>
              <option value="month">Month</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 transition duration-300"
          >
            Calculate
          </button>
        </form>
        {unitsResult && (
          <p className="text-lg text-green-600 mt-4 text-center">{unitsResult}</p>
        )}

        {/* Watt-Hour Calculation Form */}
        <form onSubmit={calculateUnitsByWattHour} className="space-y-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-700">Units by Watt * Hour</h2>
          <div>
            <label htmlFor="watts" className="block text-lg font-medium text-gray-600">
              Watts:
            </label>
            <input
              type="number"
              id="watts              "
              value={watts}
              onChange={(e) => setWatts(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="hours" className="block text-lg font-medium text-gray-600">
              Hours:
            </label>
            <input
              type="number"
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              className="border border-gray-300 p-3 rounded w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded font-medium hover:bg-blue-600 transition duration-300"
          >
            Calculate
          </button>
        </form>
        {wattHourResult && (
          <p className="text-lg text-green-600 mt-4 text-center">{wattHourResult}</p>
        )}
      </div>
    </div>
  );
};

export default Cal;
