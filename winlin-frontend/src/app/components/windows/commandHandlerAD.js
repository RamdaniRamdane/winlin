import { resolvePath, getNode } from './fsUtils';

export function handleCommandAD(input, { fs, challenge }) {
  const tokens = input.trim().split(' ');
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  if (!challenge.allowedCommands.includes(cmd)) {
    return `Access is denied: ${cmd}`;
  }

  switch (cmd) {

    case 'whoami':
      return challenge.user || 'corp\\student';

    case 'cd': {
      const target = args[0];
      if (!target) return fs.cwd;

      const newPath = resolvePath(fs, target);
      const node = getNode(fs, newPath);

      if (!node || node.type !== 'dir') {
        return 'The system cannot find the path specified.';
      }

      fs.cwd = newPath;
      return '';
    }

    case 'dir': {
      const node = getNode(fs, fs.cwd);
      if (!node || node.type !== 'dir') {
        return 'File Not Found';
      }

      return Object.keys(node.children || {}).join('\n');
    }

    case 'type': {
      const file = args[0];
      if (!file) return 'The syntax of the command is incorrect.';

      const path = resolvePath(fs, file);
      const node = getNode(fs, path);

      if (!node || node.type !== 'file') {
        return 'The system cannot find the file specified.';
      }

      return node.content || '';
    }


    case 'net':
      if (args[0] === 'user') {
        return challenge.users
          ? challenge.users.join('\n')
          : 'The request will be processed at a domain controller.';
      }

      if (args[0] === 'group') {
        return challenge.groups
          ? challenge.groups.join('\n')
          : 'System error 5 has occurred.';
      }

      return 'The syntax of this command is: NET [ USER | GROUP ]';

    case 'dsquery':
      if (args[0] === 'user') {
        return challenge.adUsers
          ? challenge.adUsers.map(u => `CN=${u}`).join('\n')
          : 'dsquery failed: No objects found';
      }

      return 'dsquery command not supported';


    case 'help':
      return [
        'Available commands:',
        '  whoami',
        '  dir',
        '  cd <directory>',
        '  type <file>',
        '  net user',
        '  net group',
        '  dsquery user',
        '  submit <FLAG>',
      ].join('\n');

    case 'submit': {
      const flag = args.join(' ');
      if (flag === challenge.flag) {
        return '__SUCCESS__';
      }
      return 'Incorrect flag';
    }

    default:
      return `'${cmd}' is not recognized as an internal or external command.`;
  }
}

