import React from 'react';
import {  TouchableWithoutFeedback,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Tipo, IconView, TipoText, ClienteText, Del, IconDel, IconNav, Mov} from './styles';
import Moment from "moment";

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
      Data: {Moment(data.datadespesa).format('DD/MM/yyyy HH:mm')} 
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