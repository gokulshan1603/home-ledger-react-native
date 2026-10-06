import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator, NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Landmark, PiggyBank, UserRound, WalletCards} from 'lucide-react-native';
import HomeScreen from '../screens/HomeScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import GoldScreen from '../screens/GoldScreen';
import AddGoldScreen from '../screens/AddGoldScreen';
import FixedDepositScreen from '../screens/FixedDepositScreen';
import AddFixedDepositScreen from '../screens/AddFixedDepositScreen';
import LoansScreen from '../screens/LoansScreen';
import AddLoanScreen from '../screens/AddLoanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {useTheme} from '../context/ThemeContext';
import {FDStackParamList, GoldStackParamList, HomeStackParamList, LoansStackParamList} from './types';
import AppHeader from '../components/AppHeader';

const Tabs = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const GoldStack = createNativeStackNavigator<GoldStackParamList>();
const FDStack = createNativeStackNavigator<FDStackParamList>();
const LoansStack = createNativeStackNavigator<LoansStackParamList>();
type TabIconProps = {color: string; size: number};
const HomeTabIcon = ({color, size}: TabIconProps) => <WalletCards color={color} size={size} strokeWidth={2.2} />;
const GoldTabIcon = ({color, size}: TabIconProps) => <Landmark color={color} size={size} strokeWidth={2.2} />;
const FDTabIcon = ({color, size}: TabIconProps) => <PiggyBank color={color} size={size} strokeWidth={2.2} />;
const LoansTabIcon = ({color, size}: TabIconProps) => <WalletCards color={color} size={size} strokeWidth={2.2} />;
const ProfileTabIcon = ({color, size}: TabIconProps) => <UserRound color={color} size={size} strokeWidth={2.2} />;

const stackOptions = (colors: ReturnType<typeof useTheme>['colors']) => ({headerShadowVisible: false, headerStyle: {backgroundColor: colors.canvas}, headerTintColor: colors.ink, headerTitleStyle: styles.headerTitle, contentStyle: {backgroundColor: colors.canvas}, header: ({navigation, route}: NativeStackHeaderProps) => { const titles: Record<string, string> = {AddEntry: 'Add entry', AddGold: 'Gold holding', AddFD: 'Fixed deposit', AddLoan: 'Loan'}; const eyebrows: Record<string, string> = {AddEntry: 'TRANSACTIONS', AddGold: 'GOLD', AddFD: 'FD', AddLoan: 'LOANS'}; return <AppHeader eyebrow={eyebrows[route.name] ?? route.name.toUpperCase()} title={titles[route.name] ?? route.name} onBack={() => navigation.goBack()} />; }});

function HomeNavigator() { const {colors} = useTheme(); return <HomeStack.Navigator screenOptions={stackOptions(colors)}><HomeStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} /><HomeStack.Screen name="AddEntry" component={AddEntryScreen} /></HomeStack.Navigator>; }
function GoldNavigator() { const {colors} = useTheme(); return <GoldStack.Navigator screenOptions={stackOptions(colors)}><GoldStack.Screen name="Gold" component={GoldScreen} options={{headerShown: false}} /><GoldStack.Screen name="AddGold" component={AddGoldScreen} /></GoldStack.Navigator>; }
function FDNavigator() { const {colors} = useTheme(); return <FDStack.Navigator screenOptions={stackOptions(colors)}><FDStack.Screen name="FD" component={FixedDepositScreen} options={{headerShown: false}} /><FDStack.Screen name="AddFD" component={AddFixedDepositScreen} /></FDStack.Navigator>; }
function LoansNavigator() { const {colors} = useTheme(); return <LoansStack.Navigator screenOptions={stackOptions(colors)}><LoansStack.Screen name="Loans" component={LoansScreen} options={{headerShown: false}} /><LoansStack.Screen name="AddLoan" component={AddLoanScreen} /></LoansStack.Navigator>; }

export default function AppTabs() {
  const {colors} = useTheme();
  return <Tabs.Navigator screenOptions={{headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.inkMuted, tabBarStyle: {backgroundColor: colors.surface, borderTopColor: colors.line}, tabBarLabelStyle: styles.tabLabel}}>
    <Tabs.Screen name="Home" component={HomeNavigator} options={{tabBarIcon: HomeTabIcon}} />
    <Tabs.Screen name="Gold" component={GoldNavigator} options={{tabBarIcon: GoldTabIcon}} />
    <Tabs.Screen name="FD" component={FDNavigator} options={{tabBarIcon: FDTabIcon}} />
    <Tabs.Screen name="Loans" component={LoansNavigator} options={{tabBarIcon: LoansTabIcon}} />
    <Tabs.Screen name="Profile" component={ProfileScreen} options={{tabBarIcon: ProfileTabIcon}} />
  </Tabs.Navigator>;
}

const styles = StyleSheet.create({headerTitle: {fontWeight: '800', fontSize: 16}, tabLabel: {fontSize: 11, fontWeight: '700'}});
