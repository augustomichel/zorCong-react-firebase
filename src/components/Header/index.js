import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import {Container, ButtonMenu, Title} from './styles';

export default function Header({titulo}) {
 const navigation = useNavigation();

 return (
   <Container>
       <ButtonMenu onPress={ () => titulo === 'Historico' || titulo === 'Cadastro de Despesas' ? navigation.goBack()  : navigation.toggleDrawer()  }>
         <Icon name={ titulo === 'Historico' || titulo === 'Cadastro de Despesas' ? "arrow-left" : "menu"} color="#FFF" size={35} />
       </ButtonMenu>  
       <Title>{titulo}</Title>    
   </Container>
  );
}