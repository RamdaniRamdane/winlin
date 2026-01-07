export const challenges = [
  {
    id: 1,
    title: 'Where am I?',
    theory: 'The flag is hidden in the path.\nuse this command when u find the flag submit your_flag',
    allowedCommands: ['pwd', 'submit','help'],
    flag: 'FLAG{filesystem_master}',
    passwordRequired: null,
    pwdContainsFlag: true,

    fs: {
      '/': {
        type: 'dir',
        children: {
          home: {
            type: 'dir',
            children: {
              user: { type: 'dir', children: {} }
            }
          }
        }
      }
    }
  },

  {
    id: 2,
    title: 'List files',
    theory: ' One filename is the flag.\nuse this command when u find the flag submit your_flag',
    allowedCommands: ['ls', 'submit','help'],
    flag: 'FLAG{ls_is_useful}',
    passwordRequired: 'FLAG{filesystem_master}',

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
                  'FLAG{ls_is_useful}': { type: 'file', content: '' },
                  notes: { type: 'file', content: 'nothing here' }
                }
              }
            }
          }
        }
      }
    }
  },

  {
    id: 3,
    title: 'Hidden files',
    theory: 'Some files are hidden.\nuse this command when u find the flag submit your_flag',
    allowedCommands: ['ls', 'submit','help'],
    flag: 'FLAG{hidden_files}',
    passwordRequired: 'FLAG{ls_is_useful}',

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
                  '.FLAG{hidden_files}': { type: 'file', content: '' },
                  visible: { type: 'file', content: 'hello' }
                }
              }
            }
          }
        }
      }
    }
  },

  {
    id: 4,
    title: 'Change directories',
    theory: 'explore folders.\nuse this command when u find the flag submit your_flag',
    allowedCommands: ['ls', 'cd', 'pwd', 'submit','help'],
    flag: 'FLAG{cd_master}',
    passwordRequired: 'FLAG{hidden_files}',

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
                  documents: {
                    type: 'dir',
                    children: {
                      work: {
                        type: 'dir',
                        children: {
                          'FLAG{cd_master}': { type: 'file', content: '' }
                        }
                      }
                    }
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
    id: 5,
    title: 'Read files',
    theory: 'read file contents.\nuse this command when u find the flag submit your_flag',
    allowedCommands: ['ls', 'cd', 'cat', 'submit','help'],
    flag: 'FLAG{cat_is_powerful}',
    passwordRequired: 'FLAG{cd_master}',

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
                  readme: {
                    type: 'file',
                    content: 'FLAG{cat_is_powerful}'
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

