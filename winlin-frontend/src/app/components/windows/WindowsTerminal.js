'use client';

import { useState, useRef } from 'react';
import BootScreen from './BootScreen';
import TerminalWindows from './TerminalWindows.js';
import { windowsChallenges } from './challenges';
import { handleCommandAD } from './commandHandlerAD';

const FLAG_REGEX = /FLAG\{[^}]+\}/;

export default function WindowsTerminal() {
  const [stage, setStage] = useState('boot');
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [detectedFlag, setDetectedFlag] = useState(null);

  const fsRef = useRef({
    tree: windowsChallenges[0].fs,
    cwd: 'C:\\Users\\Student'
  });

  const challenge = windowsChallenges[challengeIndex];

  const submit = () => {
    if (!input.trim()) return;

    const result = handleCommandAD(input, {
      fs: fsRef.current,
      challenge
    });

    /* ===== CLEAR ===== */
    if (result === '__CLEAR__') {
      setLines([]);
      setDetectedFlag(null);
      setInput('');
      return;
    }

    /* ===== SUBMIT ===== */
    if (input.toLowerCase().startsWith('submit ')) {
      const submitted = input.replace(/submit /i, '').trim();

      if (submitted === challenge.flag) {
        setLines(p => [...p, '✓ Correct flag!']);

        setTimeout(() => {
          const next = windowsChallenges[challengeIndex + 1];

          if (!next) {
            setLines(['🎉 All Windows challenges completed']);
            return;
          }

          fsRef.current = {
            tree: next.fs,
            cwd: 'C:\\Users\\Student'
          };

          setChallengeIndex(i => i + 1);
          setLines([]);
          setDetectedFlag(null);
        }, 800);
      } else {
        setLines(p => [...p, '✗ Incorrect flag']);
      }

      setInput('');
      return;
    }

    /* ===== NORMAL OUTPUT ===== */
    const safeOutput =
      typeof result === 'string'
        ? result
        : JSON.stringify(result);

    // detect flag
    const match = safeOutput.match(FLAG_REGEX);
    if (match) {
      setDetectedFlag(match[0]);
    }

    setLines(p => [
      ...p,
      `C:\\Users\\Student> ${input}`,
      safeOutput
    ]);

    setInput('');
  };

  const copyFlag = async () => {
    if (!detectedFlag) return;
    await navigator.clipboard.writeText(detectedFlag);
  };

  if (stage === 'boot') {
    return <BootScreen onFinish={() => setStage('system')} />;
  }

  return (
    <div className="flex h-screen bg-black text-white font-mono">
      {/* LEFT PANEL */}
      <div className="w-1/2 border-r border-gray-700 p-4 overflow-auto">
        <h3 className="text-lg mb-2">
          Windows Challenge {challengeIndex + 1}: {challenge.title}
        </h3>

        <pre className="text-xs opacity-70 whitespace-pre-wrap">
          {challenge.theory}
        </pre>

        {detectedFlag && (
          <div className="mt-4 p-2 border border-yellow-500 bg-yellow-900/20">
            <div className="text-yellow-400 text-sm mb-1">
              Flag detected
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs">{detectedFlag}</code>
              <button
                onClick={copyFlag}
                className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 rounded"
              >
                📋 Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TERMINAL */}
      <div className="w-1/2">
        <TerminalWindows
          lines={lines}
          input={input}
          setInput={setInput}
          onSubmit={submit}
          prompt="C:\\Users\\Student>"
        />
      </div>
    </div>
  );
}

