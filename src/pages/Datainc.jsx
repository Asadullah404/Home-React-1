import React, { useState } from "react"

const AddReading = () => {
  const [meterId, setMeterId] = useState("")
  const [reading, setReading] = useState("")
  const [readingDate, setReadingDate] = useState("")

  const handleAddReading = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meterId, reading, readingDate }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Reset form fields after successful submission
      setMeterId("")
      setReading("")
      setReadingDate("")

      // Optionally, provide feedback to the user (e.g., a success message)
      console.log("Reading added successfully!")
    } catch (error) {
      console.error("Error adding reading:", error)
      // Optionally, display an error message to the user
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Data Insertion</h1>
            <form onSubmit={handleAddReading} className="space-y-6">
              <div>
                <label htmlFor="meterId" className="block text-sm font-medium text-gray-700">
                  Meter ID
                </label>
                <input
                  type="text"
                  id="meterId"
                  value={meterId}
                  onChange={(e) => setMeterId(e.target.value)}
                  placeholder="Enter Meter ID"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="reading" className="block text-sm font-medium text-gray-700">
                  Reading
                </label>
                <input
                  type="number"
                  id="reading"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  placeholder="Enter Reading"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="readingDate" className="block text-sm font-medium text-gray-700">
                  Date of Reading
                </label>
                <input
                  type="date"
                  id="readingDate"
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddReading

