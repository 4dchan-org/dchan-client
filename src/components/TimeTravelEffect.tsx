import React from 'react';
import { useTimeTravel } from '../hooks/useTimeTravel';

interface TimeTravelEffectProps {
  children: React.ReactNode;
}

const TimeTravelEffect: React.FC<TimeTravelEffectProps> = ({ children }) => {
  const { isTimeTraveling, firstBlock, lastBlock,timeTraveledToBlockNumber } = useTimeTravel();
  const calculateSepiaIntensity = () => {
    if (!isTimeTraveling || !firstBlock || !lastBlock || !timeTraveledToBlockNumber) return 0;
    const totalBlocks = Number(lastBlock.number) - Number(firstBlock.number);
    const normalizedPosition = (Number(lastBlock.number) - Number(timeTraveledToBlockNumber)) / totalBlocks;
    return 0.1 + Math.min(normalizedPosition, 1) * 0.5;
  };

  const sepiaIntensity = calculateSepiaIntensity();

  return (
    <>
      <div style={{ filter: `sepia(${sepiaIntensity})` }}>{children}</div>
      {isTimeTraveling && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: `inset 0 0 150px rgba(0,0,0,0.8)`,
          }}
        />
      )}
    </>
  );
};

export default TimeTravelEffect;