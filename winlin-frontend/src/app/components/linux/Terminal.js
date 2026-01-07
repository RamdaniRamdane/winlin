'use client';

import { useRef } from 'react';

export default function Terminal({ lines, input, setInput, onSubmit }) {
  const ref = useRef(null);

  return (
    <div
      className="bg-black text-white p-4 font-mono text-sm min-h-screen"
      onClick={() => ref.current.focus()}
    >
      {lines.map((l, i) => <div key={i}>{l}</div>)}

      <div className="flex">
        <span className='text-green-500 font-bold'>[user@arch ~]$ </span>
        <input
          ref={ref}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

