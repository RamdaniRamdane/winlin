import { resolvePath, getNode } from './fsUtils';

export function handleCommand(input, { fs, challenge }) {
  const [cmd, ...args] = input.trim().split(' ');

  if (!challenge.allowedCommands.includes(cmd)) {
    return `command not allowed: ${cmd}`;
  }

  switch (cmd) {
    case 'pwd':
      if (challenge.pwdContainsFlag) {
        return `${fs.cwd}/${challenge.flag}`;
      }
      return fs.cwd;

    case 'ls': {
      const node = getNode(fs, fs.cwd);
      if (!node || node.type !== 'dir') return 'not a directory';

      const showAll = args.includes('-a');
      return Object.keys(node.children || {})
        .filter(name => showAll || !name.startsWith('.'))
        .join('  ');
    }

    case 'cd': {
      const target = args[0];
      if (!target) return '';
      const newPath = resolvePath(fs, target);
      const node = getNode(fs, newPath);
      if (!node || node.type !== 'dir') return 'no such directory';
      fs.cwd = newPath;
      return '';
    }

    case 'cat': {
      const file = args[0];
      if (!file) return 'usage: cat <file>';
      const path = resolvePath(fs, file);
      const node = getNode(fs, path);
      if (!node || node.type !== 'file') return 'no such file';
      return node.content || '';
    }

    case 'submit':
      return '__SUBMIT__';

    default:
      return `command not found: ${cmd}`;
  }
}

