import React, { useState, useContext,useEffect } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback, Alert} from 'react-native';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import { Background, Input, SubmitButton, SubmitText} from './styles';


export default function New() {
 const navigation = useNavigation();

 const [valor, setValor] = useState('');
 const [tipo, setTipo] = useState('');
 const [produto, setProduto] = useState('');
 const { user: usuario } = useContext(AuthContext);
 const [produtos, setProdutos] = useState([]);


 function handleSubmit(){
  Keyboard.dismiss();
  if(isNaN(parseFloat(valor)) || tipo === null){
    alert('Preencha todos os campos!');
    return;
  }

  Alert.alert(
    'Confirmando dados',
    `Tipo ${tipo} - Valor Custo: ${parseFloat(valor)} `,
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

    let key = await firebase.database().ref('produtos').child(uid).push().key;
    await firebase.database().ref('produtos').child(key).set({
      nome: tipo,
      valor: parseFloat(valor),      
    })
 }

 return (
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
       <Header/>

       <SafeAreaView style={{ alignItems: 'center' }}>
       <Input
         placeholder="Nome"
         keyboardType="text"
         returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={tipo}
         onChangeText={ (text) => setTipo(text) }
         />
         <Input
         placeholder="Valor custo"
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