import React, { useState, useContext,useEffect } from 'react';
import { SafeAreaView,Keyboard, TouchableWithoutFeedback, SubmitText,Alert, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { PedidosContext } from '../../contexts/pedidos';

import Header from '../../components/Header';
import { Background,  Saldo, List} from './styles';
import HistoricoPagamentosList from '../../components/HistoricoPagamentosList';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

export default function Conta() {
 const navigation = useNavigation();
 const { getHistoricoPagamentos , historicoPagamentos, getSaldo, saldo} = useContext(PedidosContext);
 const [loadingSave, setLoadingSave] = useState(true);

 useEffect(()=>{
  async function loadList(){
    setLoadingSave(true);
    getHistoricoPagamentos('true');
    getSaldo();
    setLoadingSave(false);
  }
  
  loadList();
 
}, []);
 

 return (
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
     
   <Background>
   <Header titulo="Conta"/>
      
       <SafeAreaView style={{ alignItems: 'center' }}>
       {
          loadingSave ? 
          <ActivityIndicator size={20} color="#FFF" />  
           :  <Saldo>R$ {saldo}</Saldo> }
       </SafeAreaView>
        { loadingSave ? 
              <List
              showsVerticalScrollIndicator={false}
              data={'a'}
              keyExtractor={ item => item.key}
              renderItem={({ item }) => ( <ActivityIndicator size={20} color="#111" />  )}
          
            />
             
            : 
            <List
            showsVerticalScrollIndicator={false}
            data={historicoPagamentos}
            keyExtractor={ item => item.key}
            renderItem={({ item }) => ( <HistoricoPagamentosList data={item} simplificado='false'/> )}
        
          />
            
        }
       
     
   </Background>
   </TouchableWithoutFeedback>
  );
}