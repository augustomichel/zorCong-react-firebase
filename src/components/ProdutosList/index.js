import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {Container, Tipo, IconView, TipoText, ClienteText, Del, IconDel, IconNav, Mov} from './styles';

export default function ProdutosList({ data, deleteItem,updateItem }) {
 return (
  <TouchableWithoutFeedback onPress={ () => updateItem(data) }>
    <Container>
        
          <ClienteText>
          {data.nome} 
          </ClienteText>
          <ClienteText>
           R$ {data.valor}
          </ClienteText>
        
        <Del>
          <TouchableWithoutFeedback onPress={ () => deleteItem(data) }>
            <IconDel tipo='Del'>
                <Icon 
                name=  'trash' 
                color="#FFF" 
                size={20} 
                />
            </IconDel>
          </TouchableWithoutFeedback>
        </Del>
        
    </Container>
   </TouchableWithoutFeedback>   
     
  );
}