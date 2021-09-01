import React from 'react';
import {  TouchableWithoutFeedback,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Tipo, IconView, TipoText, ClienteText, Del, IconDel, IconNav, Mov} from './styles';

export default function DespesasList({ data , deleteItem}) {
 return (
    <Container>
      <ClienteText>
      {data.descricao} 
      </ClienteText>
      <ClienteText>
      Fornecedor: {data.fornecedor} 
      </ClienteText>
      <ClienteText>
      Data: {data.datadespesa} 
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
    
  );
}