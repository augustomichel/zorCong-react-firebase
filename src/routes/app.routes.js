import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../pages/Home';
import New from '../pages/New';
import Produtos from '../pages/Produtos'
import Profile from '../pages/Profile';
import HistoricoPedido from '../pages/HistoricoPedido';
import CustomDrawer from '../components/CustomDrawer';
import Conta from '../pages/Conta';
import Despesa from '../pages/Despesa';
import CadDespesa from '../pages/NewDespesa';


const AppDrawer = createDrawerNavigator();

function AppRoutes(){
    return(
    <AppDrawer.Navigator
    drawerContent={ (props) => <CustomDrawer {...props} /> }

    drawerStyle={{
     backgroundColor: '#171717'
    }}
    drawerContentOptions={{
        labelStyle:{
            fontWeight: 'bold'
        },
        activeTintColor: '#FFF',
        activeBackgroundColor: '#00b94a',
        inactiveBackgroundColor: '#000',
        inactiveTintColor: '#DDD',
        unmountInactiveRoutes: true,
        itemStyle: {
            marginVertical: 5,
        }
    }}
    >
        <AppDrawer.Screen name="Home" component={Home}/>
        <AppDrawer.Screen name="Registrar Pedidos" component={New} />
        <AppDrawer.Screen name="Cadastro de Produtos" component={Produtos} />
        <AppDrawer.Screen name="Perfil" component={Profile} />
        <AppDrawer.Screen 
                name="Despesas" 
                component={Despesa} />
        <AppDrawer.Screen 
                name="Conta" 
                component={Conta} />
        <AppDrawer.Screen 
                name="Historico Pedido" 
                component={HistoricoPedido} />
        <AppDrawer.Screen 
                name="Cadastrar Despesa" 
                component={CadDespesa} />
        
        
    </AppDrawer.Navigator>
 
 

    );
}

export default AppRoutes;
