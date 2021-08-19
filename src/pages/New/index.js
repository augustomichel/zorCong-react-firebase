import React, { useState, useContext,useEffect } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert} from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import { Background, Input, SubmitButton, SubmitText} from './styles';
import Picker from '../../components/Picker';

export default function New() {
  const navigation = useNavigation();

 const [valor, setValor] = useState('');
 const [tipo, setTipo] = useState('');
 const [cliente, setCliente] = useState('');
 const { user: usuario } = useContext(AuthContext);
 const [produtos, setProdutos] = useState([]);

 useEffect(()=>{
  async function loadList(){
    
    await firebase.database().ref('produtos')
      .on('value', (snapshot)=>{
      setProdutos([]);
      
      snapshot.forEach((childItem) => {
        let list = {
          nome: childItem.val().nome
        
        };
        
        setProdutos(oldArray => [...oldArray, list].reverse());
        
      })
    })
   
    
  }
  
  loadList();
  setTipo(produtos[0])
}, []);

 function handleSubmit(){
  Keyboard.dismiss();
  
  if(isNaN(parseFloat(valor)) || tipo === null  ){
    alert('Preencha todos os campos!');
    return;
  }

  Alert.alert(
    'Confirmando dados',
    `Tipo ${tipo} - Valor: ${parseFloat(valor)} `,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => handleAdd()
      }
    ]
  )

 }

 async function handleAdd(){
   let uid = usuario.uid;

    let key = await firebase.database().ref('historico').child(uid).push().key;
    await firebase.database().ref('historico').child(uid).child(key).set({
      tipo: tipo,
      valor: parseFloat(valor),
      cliente: cliente,
      status: 'novo',
      date: format(new Date(), 'dd/MM/yyyy')
    });

    Keyboard.dismiss();
    setValor('');
    navigation.navigate('Home');

 }

 return (
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
       <Header/>

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