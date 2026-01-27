import { useState, useEffect, useRef } from 'react';

export const useCallTimer = (isActive: boolean) => {
  const [seconds, setSeconds] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSeconds(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const formatTime = () => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const hours = Math.floor(seconds / 3600);
    const getHours = `0${hours}`.slice(-2);

    return hours > 0 
      ? `${getHours}:${getMinutes}:${getSeconds}` 
      : `${getMinutes}:${getSeconds}`;
  };

  return formatTime();
};