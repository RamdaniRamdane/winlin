'use client';

import { useEffect, useState } from 'react';

const BOOT_LINES = [
  'Microsoft Windows [Version 10.0.19045]',
  '(c) Microsoft Corporation. All rights reserved.',
  '',
  'Initializing hardware abstraction layer...',
  'Loading system registry...',
  'Starting Windows services...',
  'Applying group policies...',
  '',
  'C:\\Windows\\System32>'
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
    }, 130);

    return () => clearInterval(t);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono text-sm">
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}

