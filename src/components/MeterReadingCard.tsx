import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { GlassCard } from './FuturisticUI';

interface Reading {
  reading: string | number;
  readingDate: string | number | Date;
}

interface MeterReadingCardProps {
  meterId: string;
  readings: Reading[];
}

const MeterReadingCard: React.FC<MeterReadingCardProps> = ({ meterId, readings }) => {
  return (
    <GlassCard className="overflow-hidden hover:scale-105 transition-transform duration-300">
      <div className="px-6 py-4 border-b border-gray-700 bg-black/40">
        <h3 className="text-lg font-semibold text-white">
          Meter ID: <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">{meterId}</span>
        </h3>
      </div>
      <div className="divide-y divide-gray-700/50">
        {readings.map((reading, index) => (
          <div key={index} className="px-6 py-4 flex justify-between items-center hover:bg-white/5 transition-colors duration-150">
            <div>
              <p className="text-sm font-medium text-white shadow-cyan-500/50 drop-shadow-[0_0_2px_rgba(0,255,255,0.8)]">{reading.reading} kWh</p>
              <p className="text-sm text-gray-400">{new Date(reading.readingDate).toLocaleDateString()}</p>
            </div>
            <ChevronRightIcon className="h-5 w-5 text-cyan-500/70" />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default MeterReadingCard;
