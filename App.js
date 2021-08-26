import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, StatusBar } from 'react-native';

console.disableYellowBox=true;

import AuthProvider from './src/contexts/auth';
import PedidosProvider from './src/contexts/pedidos';

import Routes from './src/routes/index';

export default function App() {
 return (
   <NavigationContainer>
    <AuthProvider>
      <PedidosProvider>
        <StatusBar backgroundColor="#131313" barStyle="light-content"/>
        <Routes/>
      </PedidosProvider>
    </AuthProvider>
    </NavigationContainer>
  );
}