'use client';

import { useState, useEffect } from 'react';
import BootScreen from './BootScreen';
import Terminal from './Terminal';
import { challenges } from './challenges';
import { runCommand } from './commandHandler';

export default function LinuxTerminal() {
  const [stage, setStage] = useState('boot'); // boot | login | system
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [challengeIndex, setChallengeIndex] = useState(0);

  const challenge = challenges[challengeIndex];

  // filesystem virtuel par challenge
  const [fs, setFs] = useState({
    tree: challenge.fs,
    cwd: '/home/user'
  });

  // reset fs quand on change de challenge
  useEffect(() => {
    setFs({
      tree: challenge.fs,
      cwd: '/home/user'
    });
    setLines([]);
    setInput('');
  }, [challengeIndex]);

  const submitCommand = () => {
    if (!input.trim()) return;

    const output = runCommand(input, {
      fs,
      challenge
    });

    setLines((prev) => [
      ...prev,
      `[user@arch ${fs.cwd}]$ ${input}`
    ]);

    if (output === '__CLEAR__') {
      setLines([]);
    } else if (output === '__SUBMIT__') {
      const submittedFlag = input.split(' ')[1];

      if (submittedFlag === challenge.flag) {
        setLines((prev) => [...prev, '✓ Correct flag']);

        const nextChallenge = challenges[challengeIndex + 1];
        if (nextChallenge) {
          setChallengeIndex((i) => i + 1);
          setStage('login'); // 🔐 password required
        } else {
          setLines((prev) => [
            ...prev,
            '════════════════════════════',
            ' All challenges completed 🎉',
            '════════════════════════════'
          ]);
        }
      } else {
        setLines((prev) => [...prev, '✗ Wrong flag']);
      }
    } else if (output) {
      setLines((prev) => [...prev, output]);
    }

    setInput('');
  };

  // 🔐 LOGIN SCREEN
  if (stage === 'login') {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-mono text-sm">
        <div>Arch Linux 6.6.10</div>
        <div className="mt-4">archlinux login: <span className="text-green-400">user</span></div>

        <div className="flex mt-2">
          <span>Password: </span>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (passwordInput === challenge.passwordRequired) {
                  setPasswordInput('');
                  setStage('system');
                } else {
                  setPasswordInput('');
                }
              }
            }}
            className="bg-transparent outline-none ml-2"
            autoFocus
          />
        </div>
      </div>
    );
  }

  // 🧠 BOOT
  if (stage === 'boot') {
    return <BootScreen onFinish={() => setStage('system')} />;
  }

  // 💻 SYSTEM / TERMINAL
  return (
    <div className="flex min-h-screen bg-black text-white font-mono text-sm">
      {/* LEFT PANEL : CHALLENGE INFO */}
      <div className="w-1/2 border-r border-gray-700 p-4 overflow-auto">
        <div className="mb-2 text-green-400">
          Challenge {challengeIndex + 1}/{challenges.length}
        </div>

        <h3 className="mb-2">{challenge.title}</h3>

        <pre className="text-xs opacity-70 whitespace-pre-wrap">
          {challenge.theory}
        </pre>

        <div className="mt-4 text-xs opacity-60">
          Allowed commands: {challenge.allowedCommands.join(', ')}
        </div>
      </div>

      {/* RIGHT PANEL : TERMINAL */}
      <div className="w-1/2">
        <Terminal
          lines={lines}
          input={input}
          setInput={setInput}
          onSubmit={submitCommand}
          cwd={fs.cwd}
        />
      </div>
    </div>
  );
}

