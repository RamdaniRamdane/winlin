import { resolvePath, getNode } from './fsUtils'; // petit helper si tu veux

export function runCommand(input, ctx) {
  const { fs, challenge } = ctx;
  const [cmd, ...args] = input.trim().split(/\s+/);

  if (!challenge.allowedCommands.includes(cmd)) {
    return `bash: ${cmd}: command not allowed`;
  }

  switch (cmd) {
    case 'ls': {
      const node = getNode(fs, fs.cwd);
      return Object.keys(node.children || {}).join('  ');
    }

    case 'pwd':
      return fs.cwd;

    case 'cd': {
      const target = resolvePath(fs, args[0]);
      const node = getNode(fs, target);
      if (!node || node.type !== 'dir') {
        return `cd: ${args[0]}: No such directory`;
      }
      fs.cwd = target;
      return null;
    }

    case 'cat': {
      const node = getNode(fs, resolvePath(fs, args[0]));
      if (!node || node.type !== 'file') {
        return `cat: ${args[0]}: No such file`;
      }
      return node.content;
    }

    case 'submit':
      return '__SUBMIT__';

    default:
      return `bash: ${cmd}: command not found`;
  }
}

