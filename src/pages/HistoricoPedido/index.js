import React, { useState, useContext,useEffect } from 'react';
import { Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator} from 'react-native';

import { PedidosContext } from '../../contexts/pedidos';
import Header from '../../components/Header';
import { Background,  SubmitText,Container, List, Area} from './styles';

import HistoricoPedidosList from '../../components/HistoricoPedidosList';

import HistoricoPagamentosList from '../../components/HistoricoPagamentosList';

export default function HistoricoPedido(data) {
 const { getHistoricoPedido ,loading, historicoPedido,getHistoricoPagamentos , historicoPagamentos, keyPedido } = useContext(PedidosContext);
 
 useEffect(()=>{
  
  async function loadList(){

    getHistoricoPedido();
    getHistoricoPagamentos();
    
  }
  loadList();
}, [keyPedido]);
 


 return (
  
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
   <Header titulo='Historico'/>   
       {
          loading ? (
            <List
              showsVerticalScrollIndicator={false}
              data={'a'}
              renderItem={() => (<ActivityIndicator size={50} color="#111" />)} 
            />  
          ) : (
            <Container>
    
              <Area>  
               <Container>
                  <SubmitText>Etapas</SubmitText>
                  <List
                    showsVerticalScrollIndicator={false}
                    data={historicoPedido}
                    keyExtractor={ item => item.key}
                    renderItem={({ item }) => ( <HistoricoPedidosList data={item} /> )}
                  />
                </Container>
                <Container>
                  <SubmitText>Pagamentos</SubmitText>
                  <List
                    showsVerticalScrollIndicator={false}
                    data={historicoPagamentos}
                    keyExtractor={ item => item.key}
                    renderItem={({ item }) => ( <HistoricoPagamentosList data={item} simplificado='true'/> )}

                  />
                </Container>
              </Area>
            
            </Container>

          )
        }
       
      
   </Background>
   </TouchableWithoutFeedback>
  );
}