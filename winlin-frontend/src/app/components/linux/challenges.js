export const challenges = [
  {
    id: 1,
    title: 'Basic Navigation',
    flag: 'FLAG{root_access}',
    passwordRequired: null, 
    allowedCommands: ['ls', 'cd', 'pwd', 'submit','cat'],
    fs: {
      '/': {
        type: 'dir',
        children: {
          home: {
            type: 'dir',
            children: {
              user: {
                type: 'dir',
                children: {
                  secret: {
                    type: 'file',
                    content: 'FLAG{root_access}'
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  {
    id: 2,
    title: 'Reading files',
    flag: 'FLAG{cat_master}',
    passwordRequired: 'FLAG{root_access}', 
    allowedCommands: ['ls', 'cd', 'pwd', 'cat', 'submit'],
    fs: {
      '/': {
        type: 'dir',
        children: {
          home: {
            type: 'dir',
            children: {
              user: {
                type: 'dir',
                children: {
                  note: {
                    type: 'file',
                    content: 'FLAG{cat_master}'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
];

