'use client';

import { useEffect, useState } from 'react';

const BOOT_LINES = [
  'Loading Linux...',
  'Initializing kernel...',
  'Starting systemd...',
  '',
  'Welcome to Arch Linux'
];

export default function BootScreen({ onFinish }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setLines((p) => [...p, BOOT_LINES[i]]);
      i++;
      if (i === BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(onFinish, 600);
      }
    }, 120);

    return () => clearInterval(t);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono text-sm">
      {lines.map((l, i) => <div key={i}>{l}</div>)}
    </div>
  );
}

