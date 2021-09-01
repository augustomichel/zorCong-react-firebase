import React, { useContext } from 'react';
import { View, Text, Image} from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import { AuthContext } from '../../contexts/auth';

export default function CustomDrawer(props) {
    const { user, signOut } = useContext(AuthContext);
    const { state, ...rest } = props;
    const newState = { ...state};  
    newState.routes = newState.routes.filter(item => item.name !== 'Historico Pedido' && item.name !== 'Cadastrar Despesa'); 
    
 return (
   <DrawerContentScrollView  {...props} >
       <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 25}}>
           <Image
           source={require('../../assets/Logo.png')}
           style={{width: 85, height: 85}}
           resizeMode="contain"
           />

           <Text style={{color: '#FFF', fontSize: 18, marginTop: 5}}>
               Bem-vindo
           </Text>
           <Text style={{color: '#FFF', fontSize: 17, fontWeight: 'bold', paddingBottom: 25}}>
               {user && user.nome}
           </Text>
       </View>

       <DrawerItemList state={newState} {...rest} />

      <DrawerItem
      {...props}
      label="Sair do app"
      inactiveBackgroundColor="#c62c36"
      onPress={ () => signOut() }
      />

   </DrawerContentScrollView>
  );
}