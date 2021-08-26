import React, { useState, useContext,useEffect } from 'react';
import { SafeAreaView, Text,Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';
import { PedidosContext } from '../../contexts/pedidos';
import Header from '../../components/Header';
import { Background, Input, SubmitButton, SubmitText,Title, Del,IconDel, List, Area, ClienteText} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import HistoricoPedidosList from '../../components/HistoricoPedidosList';
import { format, isBefore } from 'date-fns';


export default function HistoricoPedido(data) {
 const { getHistoricoPedido , historicoPedido, keyPedido } = useContext(PedidosContext);
 const [loadingSave, setLoadingSave] = useState(false);

 useEffect(()=>{
  
  async function loadList(){
    
    setLoadingSave(true);
    getHistoricoPedido();
    setLoadingSave(false);
  }
  loadList();
}, [keyPedido]);
 


 return (
  
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
   <Header titulo='Historico'/>   
       {
          loadingSave ? (
            <List
              showsVerticalScrollIndicator={false}
              data={'a'}
              renderItem={() => (<ActivityIndicator size={50} color="#111" />)} 
            />  
          ) : (
            <List
              showsVerticalScrollIndicator={false}
              data={historicoPedido}
              keyExtractor={ item => item.key}
              renderItem={({ item }) => ( <HistoricoPedidosList data={item} /> )}

            />
          )
        }
       
      
   </Background>
   </TouchableWithoutFeedback>
  );
}