'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GrubPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(0);

  const options = [
    'Linux',
    'Windows',
    'signup - idk if ill do it',
    'signin -idk if ill do it '
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((p) => (p > 0 ? p - 1 : options.length - 1));
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((p) => (p < options.length - 1 ? p + 1 : 0));
      }
      if (e.key === 'Enter') {
        if (selected === 0) router.push('/linux');
        if (selected === 1) router.push('/windows');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected, router]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <pre className="text-sm mb-8">
{`                             GNU GRUB  version 2.12`}
      </pre>

      {options.map((opt, i) => (
        <div
          key={i}
          className={`px-2 ${selected === i ? 'bg-white text-black' : ''}`}
        >
          {selected === i && '  *'} {opt}
        </div>
      ))}

      <div className="mt-8 text-xs opacity-60">
        Use ↑ ↓ and Enter to boot
      </div>
    </div>
  );
}

