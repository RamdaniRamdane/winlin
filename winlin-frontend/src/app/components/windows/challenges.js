export const windowsChallenges = [
  {
    id: 1,
    title: 'Who am I?',
    theory:
      'The flag is in your identity.\nUse the command when you find the flag: submit YOUR_FLAG',
    allowedCommands: ['whoami', 'submit', 'help'],
    flag: 'FLAG{whoami_master}',
    passwordRequired: null,

    user: 'CORP\\FLAG{whoami_master}',

    fs: {
      'C:\\': {
        type: 'dir',
        children: {
          Users: {
            type: 'dir',
            children: {
              Student: { type: 'dir', children: {} }
            }
          }
        }
      }
    }
  },

  {
    id: 2,
    title: 'List users',
    theory:
      'One domain user is the flag.\nUse the command when you find the flag: submit YOUR_FLAG',
    allowedCommands: ['net', 'submit', 'help'],
    flag: 'FLAG{net_user_enum}',
    passwordRequired: 'FLAG{whoami_master}',

    users: [
      'Administrator',
      'Guest',
      'Student',
      'FLAG{net_user_enum}'
    ],

    fs: {
      'C:\\': {
        type: 'dir',
        children: {}
      }
    }
  },

  {
    id: 3,
    title: 'Hidden domain objects',
    theory:
      'Some objects are hidden.\nUse the command when you find the flag: submit YOUR_FLAG',
    allowedCommands: ['dsquery', 'submit', 'help'],
    flag: 'FLAG{hidden_ad_object}',
    passwordRequired: 'FLAG{net_user_enum}',

    adUsers: [
      'Administrator',
      'svc_backup',
      'CN=FLAG{hidden_ad_object},OU=Hidden,DC=corp,DC=local'
    ],

    fs: {
      'C:\\': {
        type: 'dir',
        children: {}
      }
    }
  },

  {
    id: 4,
    title: 'Navigate directories',
    theory:
      'Explore folders.\nUse the command when you find the flag: submit YOUR_FLAG',
    allowedCommands: ['dir', 'cd', 'submit', 'help'],
    flag: 'FLAG{cd_windows_master}',
    passwordRequired: 'FLAG{hidden_ad_object}',

    fs: {
      'C:\\': {
        type: 'dir',
        children: {
          Users: {
            type: 'dir',
            children: {
              Student: {
                type: 'dir',
                children: {
                  Documents: {
                    type: 'dir',
                    children: {
                      Reports: {
                        type: 'dir',
                        children: {
                          'FLAG{cd_windows_master}.txt': {
                            type: 'file',
                            content: ''
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
    }
  },

  {
    id: 5,
    title: 'Read files',
    theory:
      'Read file contents.\nUse the command when you find the flag: submit YOUR_FLAG',
    allowedCommands: ['dir', 'cd', 'type', 'submit', 'help'],
    flag: 'FLAG{type_is_powerful}',
    passwordRequired: 'FLAG{cd_windows_master}',

    fs: {
      'C:\\': {
        type: 'dir',
        children: {
          Users: {
            type: 'dir',
            children: {
              Student: {
                type: 'dir',
                children: {
                  readme: {
                    type: 'file',
                    content: 'FLAG{type_is_powerful}'
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

