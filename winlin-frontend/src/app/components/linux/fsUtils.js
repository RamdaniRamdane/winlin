
export function resolvePath(fs, path) {
  if (!path || path === '.') return fs.cwd;

  if (path.startsWith('/')) return normalize(path);

  if (path === '..') {
    const parts = fs.cwd.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }

  return normalize(
    fs.cwd === '/' ? `/${path}` : `${fs.cwd}/${path}`
  );
}

export function getNode(fs, path) {
  const parts = path.split('/').filter(Boolean);
  let node = fs.tree['/'];

  for (const part of parts) {
    if (!node.children || !node.children[part]) return null;
    node = node.children[part];
  }

  return node;
}

function normalize(path) {
  const stack = [];

  path.split('/').forEach((part) => {
    if (!part || part === '.') return;
    if (part === '..') stack.pop();
    else stack.push(part);
  });

  return '/' + stack.join('/');
}

