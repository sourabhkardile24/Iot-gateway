const IoTColors = {
  light: {
    temperature: {
      primary: '#ef4444',
      secondary: '#f97316',
      bg: '#fff1f2',
      text: '#b91c1c',
    },
    humidity: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      bg: '#e0f2fe',
      text: '#1e40af',
    },
    pressure: {
      primary: '#8b5cf6',
      secondary: '#6366f1',
      bg: '#ede9fe',
      text: '#4c1d95',
    },
    flow: {
      primary: '#10b981',
      secondary: '#14b8a6',
      bg: '#ecfdf5',
      text: '#047857',
    },
    voltage: {
      primary: '#eab308',
      secondary: '#f59e0b',
      bg: '#fef9c3',
      text: '#92400e',
    },
    status: {
      online: '#22c55e',
      warning: '#f59e0b',
      offline: '#ef4444',
      gradient: {
        connected: ['#10b981', '#0ea5e9'],
        disconnected: ['#ef4444', '#f97316'],
        warning: ['#f59e0b', '#f97316'],
      },
    },
  },
  dark: {
    temperature: {
      primary: '#ef4444',
      secondary: '#f97316',
      bg: '#7f1d1d',
      text: '#fee2e2',
    },
    humidity: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      bg: '#1e3a8a',
      text: '#bfdbfe',
    },
    pressure: {
      primary: '#8b5cf6',
      secondary: '#6366f1',
      bg: '#4c1d95',
      text: '#ddd6fe',
    },
    flow: {
      primary: '#10b981',
      secondary: '#14b8a6',
      bg: '#064e3b',
      text: '#d1fae5',
    },
    voltage: {
      primary: '#eab308',
      secondary: '#f59e0b',
      bg: '#713f12',
      text: '#fef3c7',
    },
    status: {
      online: '#22c55e',
      warning: '#f59e0b',
      offline: '#ef4444',
      gradient: {
        connected: ['#10b981', '#0ea5e9'],
        disconnected: ['#ef4444', '#f97316'],
        warning: ['#f59e0b', '#f97316'],
      },
    },
  },
};

export default IoTColors;
