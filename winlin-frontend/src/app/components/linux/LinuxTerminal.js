'use client';

import { useState, useRef } from 'react';
import BootScreen from './BootScreen';
import Terminal from './Terminal';
import { challenges } from './challenges';
import { handleCommand } from './commandHandler';

const FLAG_REGEX = /FLAG\{[^}]+\}/;

export default function LinuxTerminal() {
  const [stage, setStage] = useState('boot');
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [detectedFlag, setDetectedFlag] = useState(null);

  const fsRef = useRef({
    tree: challenges[0].fs,
    cwd: '/home/user'
  });

  const challenge = challenges[challengeIndex];

  const submit = () => {
    if (!input.trim()) return;

    const result = handleCommand(input, {
      fs: fsRef.current,
      challenge
    });

    // clear
    if (result === '__CLEAR__') {
      setLines([]);
      setDetectedFlag(null);
      setInput('');
      return;
    }

    // submit
    if (input.startsWith('submit ')) {
      const submitted = input.replace('submit ', '').trim();

      if (submitted === challenge.flag) {
        setLines(p => [...p, '✓ Correct flag!']);

        setTimeout(() => {
          const next = challenges[challengeIndex + 1];
          if (!next) {
            setLines([':) All challenges completed']);
            return;
          }

          fsRef.current = {
            tree: next.fs,
            cwd: '/home/user'
          };

          setChallengeIndex(i => i + 1);
          setLines([]);
          setDetectedFlag(null);
        }, 800);

      } else {
        setLines(p => [...p, '✗ Wrong flag']);
      }

      setInput('');
      return;
    }

    // normal output
    const outputLines = [
      `[user@arch ~]$ ${input}`,
      result
    ];

    // 🔍 detect flag
    if (typeof result === 'string') {
      const match = result.match(FLAG_REGEX);
      if (match) {
        setDetectedFlag(match[0]);
      }
    }

    setLines(p => [...p, ...outputLines]);
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
          Challenge {challengeIndex + 1}: {challenge.title}
        </h3>

        <pre className="text-xs opacity-70 whitespace-pre-wrap">
          {challenge.theory}
        </pre>

        {detectedFlag && (
          <div className="mt-4 p-2 border border-green-500 bg-green-900/20">
            <div className="text-green-400 text-sm mb-1">
              Flag detected
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs">{detectedFlag}</code>
              <button
                onClick={copyFlag}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
              >
                📋 Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TERMINAL */}
      <div className="w-1/2">
        <Terminal
          lines={lines}
          input={input}
          setInput={setInput}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}

