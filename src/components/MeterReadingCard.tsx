import React from 'react';
import { ChevronRightIcon } from 'lucide-react';

const MeterReadingCard = ({ meterId, readings }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Meter ID: {meterId}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {readings.map((reading, index) => (
          <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-150">
            <div>
              <p className="text-sm font-medium text-gray-900">{reading.reading} kWh</p>
              <p className="text-sm text-gray-500">{new Date(reading.readingDate).toLocaleDateString()}</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeterReadingCard;
