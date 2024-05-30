import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';

import LandingScreen from '../screens/landing/LandingScreen'
import InputScreen from '../screens/landing/InputScreen'

const Stack = createStackNavigator()

function LoginStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      {/* <Stack.Screen name="TestLogin" component={TestLogin} /> */}
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="LandingInput" component={InputScreen} />
    </Stack.Navigator>
  )
}

export default LoginStack