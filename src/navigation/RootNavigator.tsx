import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import {RootStackParamList} from './types';
import {useTheme} from '../context/ThemeContext';
import AppTabs from './AppTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {user, loading} = useAuth();
  const {colors} = useTheme();

  if (loading) {
    return (
      <View style={[styles.loading, {backgroundColor: colors.canvas}]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {...DefaultTheme.colors, background: colors.canvas, card: colors.canvas, text: colors.ink, primary: colors.primary},
      }}>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: colors.canvas},
          headerTintColor: colors.ink,
          headerTitleStyle: {fontWeight: '800', fontSize: 16},
          contentStyle: {backgroundColor: colors.canvas},
        }}>
        {user ? (
          <Stack.Screen name="MainTabs" component={AppTabs} options={{headerShown: false}} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({loading: {flex: 1, alignItems: 'center', justifyContent: 'center'}});
