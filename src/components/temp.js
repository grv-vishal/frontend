import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

function VehicleBatteryIndicator({ state , soc }) {
  const outlineColor =
    state === 'charging'
      ? 'border-green-500'
      : state === 'discharging'
      ? 'border-red-500'
      : 'border-blue-500';

  const fillColor =
    state === 'charging'
      ? 'bg-green-400'
      : state === 'discharging'
      ? 'bg-red-400'
      : 'bg-blue-300';
  

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className={`relative h-full w-full border-4 rounded-md ${outlineColor} overflow-hidden bg-white`}>
        {/* Filling animation */}
        <motion.div
          className={`absolute bottom-0 w-full ${fillColor}`}
          style={{ height: `${soc}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${soc}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}

export default VehicleBatteryIndicator;
