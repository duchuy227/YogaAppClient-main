import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ClassScreen from './screens/ClassScreen';
import { colors } from './themes/colors';

import Ionicons from "@expo/vector-icons/Ionicons";
import { CartProvider } from './context/CartContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="home"
                size={24}
                color={focused ? colors.primary.DEFAULT : colors.grey}
              />
            ),
          }} />
          <Tab.Screen name="Cart" component={CartScreen} options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="cart"
                size={24}
                color={focused ? colors.primary.DEFAULT : colors.grey}
              />
            ),
          }} />
          <Tab.Screen name="Class" component={ClassScreen} options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="calendar"
                size={24}
                color={focused ? colors.primary.DEFAULT : colors.grey}
              />
            ),
          }} />
        </Tab.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
