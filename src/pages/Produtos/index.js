import React, { useState, useContext,useEffect } from 'react';
import { SafeAreaView, Text,Keyboard, TouchableWithoutFeedback, Alert, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';

import Header from '../../components/Header';
import { Background, Input, SubmitButton, SubmitText,Title, Del,IconDel, List, Area, ClienteText} from './styles';
import Icon from 'react-native-vector-icons/Feather';
import ProdutosList from '../../components/ProdutosList';
import { format, isBefore } from 'date-fns';


export default function Produtos() {
 const navigation = useNavigation();
 const { user } = useContext(AuthContext);

 const [valor, setValor] = useState('');
 const [tipo, setTipo] = useState('');
 const [produtos, setProdutos] = useState([]);
 const { user: usuario } = useContext(AuthContext);
 const [historico, setHistorico] = useState([]);
 const [nmBtn, setNmbtn] = useState('Adicionar');
 const [produto, setProduto] = useState('');
 const [loadingSave, setLoadingSave] = useState(false);

 useEffect(()=>{
  
  async function loadList(){
    setLoadingSave(true);
    let uid = usuario.uid;
    let eid = usuario.empresa;
    await firebase.database().ref('produtos').child(eid)
      .on('value', (snapshot)=>{
      setProdutos([]);
      
      snapshot.forEach((childItem) => {
        let list = {
          key: childItem.key,
          nome: childItem.val().nome,
          valor: childItem.val().valor,
        };
        
        setProdutos(oldArray => [...oldArray, list].reverse());
        
      })
      
    })   
    setLoadingSave(false);
  }
  
  loadList();
 
}, []);
 

 function handleSubmit(){
  Keyboard.dismiss();
  if(isNaN(parseFloat(valor)) || tipo === null){
    alert('Preencha todos os campos!');
    return;
  }
  
    Alert.alert(
      'Confirmando dados',
      ` ${tipo} - Valor Custo: ${parseFloat(valor)} `,
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
    setLoadingSave(true);
    let uid = usuario.uid;
    let eid = usuario.empresa;

    let key = await firebase.database().ref('produtos').child(eid).push().key;
    await firebase.database().ref('produtos').child(eid).child(key).set({
      nome: tipo,
      valor: parseFloat(valor),      
    });
    
    Keyboard.dismiss();
    setValor('');
    setLoadingSave(false);
    this.loadList();
  
 }

 function handleDelete(data){
  Alert.alert(
    'Cuidado Atençao!',
    `Você deseja excluir  ${data.nome} - Valor: ${data.valor}`,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => handleDeleteSuccess(data)
      }
    ]
  )
}


async function handleDeleteSuccess(data){
  setLoadingSave(true);
  let uid = usuario.uid;
  let eid = usuario.empresa;
  await firebase.database().ref('produtos')
  .child(eid).child(data.key).remove()
  .catch((error)=>{
    console.log(error);
  })
  setLoadingSave(false);
  this.loadList();
}

function carregaUpdate(data){
  setTipo(data.nome);
  setValor('' + data.valor);
  setNmbtn('Alterar');
  setProduto(data.key);
}

function handleUpdate(data){
  Keyboard.dismiss();
  if(isNaN(parseFloat(valor)) || tipo === null){
    alert('Preencha todos os campos!');
    return;
  }

  Alert.alert(
    'Cuidado Atençao!',
    `Você deseja alterar ${tipo} - Valor: ${parseFloat(valor)}`,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => handleUpdateSuccess()
      }
    ]
  )
}

async function handleUpdateSuccess(){
  let uid = usuario.uid;
  let eid = usuario.empresa;
  setLoadingSave(true);
  await firebase.database().ref('produtos')
  .child(eid).child(produto).update({ 
      nome: tipo,
      valor: parseFloat(valor),
  })
  limpaTela();
  setLoadingSave(false);
  this.loadList();
}

function limpaTela(){
  setTipo('');
  setValor('' );
  setNmbtn('Adicionar');
  setProduto([]); 
}

 return (
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
       <Header titulo="Cadastro de Produtos"/>
       
       <SafeAreaView style={{ alignItems: 'center' }}>
       <Input
         placeholder="Nome"
         editable={loadingSave ? false : true}
         keyboardType="text"
         returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={tipo}
         onChangeText={ (text) => setTipo(text) }
         />
         <Input
         placeholder="Valor custo"
         editable={loadingSave ? false : true}
         keyboardType="numeric"
         returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={valor}
         onChangeText={ (text) => setValor(text) }
         />
      <Area>
        <SubmitButton onPress={limpaTela}>
        {
          loadingSave ? (
            <ActivityIndicator size={20} color="#FFF" />
          ) : (
            <SubmitText>Limpar</SubmitText>
          )
        }
      
        </SubmitButton>
        <SubmitButton onPress={nmBtn === 'Adicionar' ? handleSubmit : handleUpdate}>
        {
          loadingSave ? (
            <ActivityIndicator size={20} color="#FFF" />
          ) : (
            <SubmitText>{nmBtn}</SubmitText>
          )
        }
        </SubmitButton>
       </Area>

       </SafeAreaView>
      
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
              data={produtos}
              keyExtractor={ item => item.key}
              renderItem={({ item }) => ( <ProdutosList data={item} deleteItem={handleDelete} updateItem={carregaUpdate} /> )}

            />
          )
        }
       
      
   </Background>
   </TouchableWithoutFeedback>
  );
}