export function resolvePath(fs, path) {
  if (!path || path === '.') return fs.cwd;

  // Absolute path (C:\...)
  if (/^[A-Za-z]:\\/.test(path)) {
    return normalize(path);
  }

  // Parent directory
  if (path === '..') {
    const parts = fs.cwd.split('\\').filter(Boolean);
    parts.pop();
    return parts.length === 1
      ? parts[0] + '\\'
      : parts.join('\\');
  }

  // Relative path
  return normalize(
    fs.cwd.endsWith('\\')
      ? fs.cwd + path
      : fs.cwd + '\\' + path
  );
}

export function getNode(fs, path) {
  const parts = path.split('\\').filter(Boolean);
  const drive = parts.shift(); // C:
  let node = fs.tree[drive + '\\'];

  if (!node) return null;

  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }

  return node;
}

function normalize(path) {
  const parts = path.replace(/\//g, '\\').split('\\');
  const stack = [];

  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }

  // Drive root
  if (stack.length === 1 && stack[0].endsWith(':')) {
    return stack[0] + '\\';
  }

  return stack[0] + '\\' + stack.slice(1).join('\\');
}

