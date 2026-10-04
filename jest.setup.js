/* eslint-env jest */

jest.mock('react-native-url-polyfill/auto', () => ({}));

jest.mock('lucide-react-native', () => {
  const Icon = () => null;
  return {
    ArrowDown: Icon,
    ArrowUp: Icon,
    CalendarDays: Icon,
    ChevronLeft: Icon,
    ChevronRight: Icon,
    IndianRupee: Icon,
    Landmark: Icon,
    LogOut: Icon,
    Moon: Icon,
    Plus: Icon,
    Sun: Icon,
    Trash2: Icon,
    Wallet: Icon,
    WalletCards: Icon,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async () => null),
  setItem: jest.fn(async () => undefined),
  removeItem: jest.fn(),
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: callback => {
        callback('INITIAL_SESSION', null);
        return {data: {subscription: {unsubscribe: jest.fn()}}};
      },
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(async () => ({data: {user: null}})),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({select: jest.fn(() => ({single: jest.fn()}))})),
      update: jest.fn(() => ({eq: jest.fn()})),
      delete: jest.fn(() => ({eq: jest.fn()})),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          gte: jest.fn(() => ({
            lt: jest.fn(() => ({order: jest.fn()})),
          })),
          order: jest.fn(),
        })),
      })),
    })),
    channel: jest.fn(() => ({
      on: jest.fn(function () { return this; }),
      subscribe: jest.fn(),
    })),
    removeChannel: jest.fn(),
  }),
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}) => children,
  DefaultTheme: {colors: {background: '#fff', card: '#fff', text: '#000', primary: '#000'}},
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: () => null,
  }),
}));
