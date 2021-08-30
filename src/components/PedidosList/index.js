import React, {useContext,useState} from 'react';
import {  TouchableWithoutFeedback,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { PedidosContext } from '../../contexts/pedidos';

import {Container, Tipo, IconView, TipoText, ClienteText,IconPay, Del, IconDel, IconNav, Mov} from './styles';

export default function PedidosList({ data, deleteItem,pagar, updateItemBack,updateItemFoward ,abreHistorico}) {
  const { loadingPag } = useContext(PedidosContext);
  //const [loading, setLoading] = useState(false);
  return (
   <TouchableWithoutFeedback onLongPress={ () => abreHistorico(data) }>
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
              data.status === 'pronto' ? 'play' : 'check'} 
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
      {data.tipo} - {data.cliente} 
      </ClienteText>
      <ClienteText>
       {data.date}
      </ClienteText>
                
      <Del>
        <TouchableWithoutFeedback onPress={ () => pagar(data) }>
        {
          loadingPag ? 
          <IconPay tipo='Pay' status= {data.pago === "Sim" ? "1" : "2"}>
            <ActivityIndicator size={20} color="#fff" />  
          </IconPay>
           :   
          <IconPay tipo='Pay' status= {data.pago === "Sim" ? "1" : "2"}>
              <Icon 
              name=  'dollar-sign' 
              color="#FFF" 
              size={20} 
              />
              
              <TipoText>{data.pago === "Sim" ? "Pago" : ""}</TipoText>

          </IconPay>
        }   
        </TouchableWithoutFeedback>
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