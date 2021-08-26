import React, { useState, useContext,useEffect, Component } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert} from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { PedidosContext } from '../../contexts/pedidos';

import Header from '../../components/Header';
import { Background, Input, SubmitButton, SubmitText, PickerView} from './styles';
import Picker from '../../components/Picker';
import { Tipo } from '../../components/PedidosList/styles';
import { ValidationError } from 'jest-validate';

export default function New() {
  
 const navigation = useNavigation();
 const {handleAdd, getProdutos, produtos} = useContext(PedidosContext);
 const [valor, setValor] = useState([]);
 const [tipo, setTipo] = useState([]);
 const [cliente, setCliente] = useState('');
 


 useEffect(()=>{
  async function loadList(){
    
    getProdutos();

 
  }
  
  loadList();
  
}, []);

useEffect(()=>{
  
  async function loadList(){    
    if (tipo.valor === undefined){
      setValor('' + tipo);       
    } else {
      setValor('' + tipo.valor);
    }
    setPreco(valor);
  }
  
  loadList();
 
}, [tipo]);


 function handleSubmit(){
  Keyboard.dismiss();
 
  if(isNaN(parseFloat(valor)) || cliente === ''  ){
    alert('Preencha todos os campos!');
    return;
  }

  Alert.alert(
    'Confirmando dados',
    `${tipo.nome === undefined ? tipo : tipo.nome} - Valor: ${parseFloat(valor)} - ${cliente} `,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => (handleAdd(tipo, cliente, valor), navigation.navigate('Home'))
      }
    ]
  )
  
     
 }


 return (
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
       <Header titulo="Cadastro de Pedidos"/>

       <SafeAreaView style={{ alignItems: 'center' }}>
       <Input
         placeholder="Cliente"
         keyboardType="text"
         returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={cliente}
         onChangeText={ (text) => setCliente(text) }
        />
          

        <Picker onChange={setTipo} tipo={tipo} produtos={produtos} />

        <Input
         placeholder="Valor produto"
         keyboardType="numeric"
         returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={valor}
         onChangeText={ (text) => setValor(text) }
        />
         
        <SubmitButton onPress={handleSubmit}>
          <SubmitText>Registrar</SubmitText>
        </SubmitButton>

       </SafeAreaView>

   </Background>
   </TouchableWithoutFeedback>
  );
}