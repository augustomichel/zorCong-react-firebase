import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import {Container, Tipo, IconView, TipoText, ClienteText, Del, IconDel, IconNav, Mov} from './styles';

export default function HistoricoList({ data, deleteItem, updateItemBack,updateItemFoward }) {
 return (
   <TouchableWithoutFeedback onLongPress={ () => updateItem(data) }>
   <Container>
      <Tipo>
          <Mov>
          <TouchableWithoutFeedback  onPress={ () => updateItemBack(data) }>
            <IconNav tipo='Back'>
                <Icon 
                name=  'arrow-left-circle' 
                color="#111" 
                size={20} 
                />
            </IconNav>
          </TouchableWithoutFeedback>
        </Mov>
        <IconView tipo={data.status}>
              <Icon 
              name={data.status === 'novo' ? 'plus' :
              data.status === 'congelando' ? 'archive' :
              data.status === 'fazendo' ? 'tool' :
              data.status === 'congelando' ? 'play' : 'check'} 
              color="#FFF" 
              size={20} 
              />
              <TipoText>{data.status}</TipoText>
          </IconView>
        <Mov>
          <TouchableWithoutFeedback onPress={ () => updateItemFoward(data) }>
            <IconNav tipo='Forw'>
                <Icon 
                name=  'arrow-right-circle' 
                color="#111" 
                size={20} 
                />
            </IconNav>
          </TouchableWithoutFeedback>
        </Mov>
      </Tipo>
      <ClienteText>
      {data.tipo} - {data.cliente} - {data.date}
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