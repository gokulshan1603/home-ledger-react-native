import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator, NativeStackHeaderProps} from '@react-navigation/native-stack';
import {BadgeIndianRupee, Gem, HandCoins, UserRound, WalletCards} from 'lucide-react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import GoldScreen from '../screens/GoldScreen';
import AddGoldScreen from '../screens/AddGoldScreen';
import FixedDepositScreen from '../screens/FixedDepositScreen';
import AddFixedDepositScreen from '../screens/AddFixedDepositScreen';
import LoansScreen from '../screens/LoansScreen';
import AddLoanScreen from '../screens/AddLoanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {useTheme} from '../context/ThemeContext';
import {FDStackParamList, GoldStackParamList, LoansStackParamList, TransactionsStackParamList} from './types';
import AppHeader from '../components/AppHeader';

const Tabs = createBottomTabNavigator();
const TransactionsStack = createNativeStackNavigator<TransactionsStackParamList>();
const GoldStack = createNativeStackNavigator<GoldStackParamList>();
const FDStack = createNativeStackNavigator<FDStackParamList>();
const LoansStack = createNativeStackNavigator<LoansStackParamList>();
type TabIconProps = {color: string; focused: boolean};
const TabIcon = ({focused, children}: {focused: boolean; children: React.ReactNode}) => <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>{children}</View>;
const TransactionsTabIcon = ({color, focused}: TabIconProps) => <TabIcon focused={focused}><WalletCards color={color} size={21} strokeWidth={focused ? 2.4 : 2.1} /></TabIcon>;
const GoldTabIcon = ({color, focused}: TabIconProps) => <TabIcon focused={focused}><Gem color={color} size={21} strokeWidth={focused ? 2.4 : 2.1} /></TabIcon>;
const FDTabIcon = ({color, focused}: TabIconProps) => <TabIcon focused={focused}><BadgeIndianRupee color={color} size={21} strokeWidth={focused ? 2.4 : 2.1} /></TabIcon>;
const LoansTabIcon = ({color, focused}: TabIconProps) => <TabIcon focused={focused}><HandCoins color={color} size={21} strokeWidth={focused ? 2.4 : 2.1} /></TabIcon>;
const ProfileTabIcon = ({color, focused}: TabIconProps) => <TabIcon focused={focused}><UserRound color={color} size={21} strokeWidth={focused ? 2.4 : 2.1} /></TabIcon>;

const stackOptions = (colors: ReturnType<typeof useTheme>['colors']) => ({headerShadowVisible: false, headerStyle: {backgroundColor: colors.canvas}, headerTintColor: colors.ink, headerTitleStyle: styles.headerTitle, contentStyle: {backgroundColor: colors.canvas}, header: ({navigation, route}: NativeStackHeaderProps) => { const titles: Record<string, string> = {AddEntry: 'Add entry', AddGold: 'Gold holding', AddFD: 'Fixed deposit', AddLoan: 'Loan'}; return <AppHeader title={titles[route.name] ?? route.name} onBack={() => navigation.goBack()} />; }});

function TransactionsNavigator() { const {colors} = useTheme(); return <TransactionsStack.Navigator screenOptions={stackOptions(colors)}><TransactionsStack.Screen name="Transactions" component={TransactionsScreen} options={{headerShown: false}} /><TransactionsStack.Screen name="AddEntry" component={AddEntryScreen} /></TransactionsStack.Navigator>; }
function GoldNavigator() { const {colors} = useTheme(); return <GoldStack.Navigator screenOptions={stackOptions(colors)}><GoldStack.Screen name="Gold" component={GoldScreen} options={{headerShown: false}} /><GoldStack.Screen name="AddGold" component={AddGoldScreen} /></GoldStack.Navigator>; }
function FDNavigator() { const {colors} = useTheme(); return <FDStack.Navigator screenOptions={stackOptions(colors)}><FDStack.Screen name="FD" component={FixedDepositScreen} options={{headerShown: false}} /><FDStack.Screen name="AddFD" component={AddFixedDepositScreen} /></FDStack.Navigator>; }
function LoansNavigator() { const {colors} = useTheme(); return <LoansStack.Navigator screenOptions={stackOptions(colors)}><LoansStack.Screen name="Loans" component={LoansScreen} options={{headerShown: false}} /><LoansStack.Screen name="AddLoan" component={AddLoanScreen} /></LoansStack.Navigator>; }

export default function AppTabs() {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();
  return <Tabs.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.inkMuted, tabBarHideOnKeyboard: true, tabBarStyle: {backgroundColor: colors.surface, borderTopColor: colors.line, borderTopWidth: StyleSheet.hairlineWidth, elevation: 0, height: 64 + insets.bottom, paddingBottom: insets.bottom + 5, paddingTop: 5, shadowColor: 'transparent', shadowOpacity: 0}, tabBarItemStyle: styles.tabItem, tabBarIconStyle: styles.tabIconSlot, tabBarLabelStyle: styles.tabLabel}}>
    <Tabs.Screen name="Transactions" component={TransactionsNavigator} options={{tabBarIcon: TransactionsTabIcon, tabBarLabel: 'Transactions'}} />
    <Tabs.Screen name="Gold" component={GoldNavigator} options={{tabBarIcon: GoldTabIcon}} />
    <Tabs.Screen name="FD" component={FDNavigator} options={{tabBarIcon: FDTabIcon}} />
    <Tabs.Screen name="Loans" component={LoansNavigator} options={{tabBarIcon: LoansTabIcon}} />
    <Tabs.Screen name="Profile" component={ProfileScreen} options={{tabBarIcon: ProfileTabIcon}} />
  </Tabs.Navigator>;
}

const styles = StyleSheet.create({
  headerTitle: {fontWeight: '800', fontSize: 16},
  tabItem: {paddingVertical: 1},
  tabIconSlot: {height: 26, marginBottom: 1},
  tabIcon: {height: 26, width: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 13},
  tabIconFocused: {backgroundColor: 'rgba(66,133,244,0.12)'},
  tabLabel: {fontSize: 11, fontWeight: '700', lineHeight: 14, marginTop: 1, includeFontPadding: false},
});
