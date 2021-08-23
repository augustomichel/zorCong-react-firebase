import React, { useContext, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Platform } from 'react-native';
import firebase from '../../services/firebaseConnection';
import { format, isBefore } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import PedidosList from '../../components/PedidosList';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

import { Background, Container, Nome, Saldo, Title, List, Area, AddIcon} from './styles';

export default function Home() {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);

  const { user } = useContext(AuthContext);
  const uid = user && user.uid;
  const eid = user && user.empresa;
  const [newDate, setNewDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  useEffect(()=>{
    async function loadList(){
      await firebase.database().ref('empresas').child(eid).on('value', (snapshot)=>{
        setSaldo(snapshot.val().saldo);
      });

      await firebase.database().ref('historico')
      .child(eid)
      .orderByChild('date').equalTo(format(newDate, 'dd/MM/yyyy'))
      .limitToLast(20).on('value', (snapshot)=>{
        setHistorico([]);
        
        snapshot.forEach((childItem) => {
          let list = {
            key: childItem.key,
            tipo: childItem.val().tipo,
            valor: childItem.val().valor,
            date: childItem.val().date,
            status: childItem.val().status,
            cliente: childItem.val().cliente
          };
          
          setHistorico(oldArray => [...oldArray, list].reverse());
        })
      })

    }

    loadList();
  }, [newDate]);


  function handleDelete(data){

    //Pegando data do item:
    const [diaItem, mesItem, anoItem] = data.date.split('/');
    const dateItem = new Date(`${anoItem}/${mesItem}/${diaItem}`);
    console.log(dateItem);

    //Pegando data hoje:
    const formatDiaHoje = format(new Date(), 'dd/MM/yyyy');
    const [diaHoje, mesHoje, anoHoje] = formatDiaHoje.split('/');
    const dateHoje = new Date(`${anoHoje}/${mesHoje}/${diaHoje}`);
    console.log(dateHoje);

    Alert.alert(
      'Cuidado Atençao!',
      `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`,
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
    await firebase.database().ref('historico')
    .child(eid).child(data.key).remove()
    .then( async ()=>{
      let saldoAtual = saldo;
      data.status === 'entregue' ? saldoAtual -= parseFloat(data.valor) : '' ;

      await firebase.database().ref('empresas').child(eid)
      .child('saldo').set(saldoAtual);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  function handleShowPicker(){
    setShow(true);
  }

  function handleClose(){
    setShow(false);
  }

  const onChange = (date) => {
    setShow(Platform.OS === 'ios');
    setNewDate(date);
    console.log(date);
  } 

  function handleUpdateBack(data){
      if( data.status === 'novo'){
        // Se registro é novo não pode voltar!
        alert('Voce nao pode voltar pedido novo!');
        return;
      }
    
    Alert.alert(
      'Cuidado Atençao!',
      `Você deseja alterar seu pedido ${data.tipo} - Cliente: ${data.cliente}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => handleUpdateBackSuccess(data)
        }
      ]
    )

  }

  async function handleUpdateBackSuccess(data){
    let novoStatus = '';
    switch(data.status) { 
      case 'congelando':
        novoStatus = 'fazendo';
        break;
      case 'entregue':
        novoStatus = 'congelando';
        break;
      case 'fazendo':
        novoStatus = 'novo';
        break;
      }
  
    await firebase.database().ref('historico')
    .child(eid).child(data.key).update({ 
        status: novoStatus
    })
    .then( async ()=>{
      let saldoAtual = saldo;
      novoStatus === 'congelando' ? saldoAtual -= parseFloat(data.valor) : '';

      await firebase.database().ref('empresas').child(eid)
      .child('saldo').set(saldoAtual);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  function handleUpdateFoward(data){   
    if( data.status === 'entregue'){
      // Se o registro esta entregue não pode avançar!
      alert('Voce nao pode alterar pedido já entregue!');
      return;
    }
    Alert.alert(
      'Cuidado Atençao!',
      `Você deseja alterar seu pedido ${data.tipo} - Cliente: ${data.cliente}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: () => handleUpdateFowardSuccess(data)
        }
      ]
    )

  }

  async function handleUpdateFowardSuccess(data){
    let novoStatus = '';
    
    switch(data.status) { 
      case 'novo':
        novoStatus = 'fazendo';
        break;
      case 'fazendo':
        novoStatus = 'congelando';
        break;
      case 'congelando':
        novoStatus = 'entregue';
        break;
      }
    
  
    await firebase.database().ref('historico')
    .child(eid).child(data.key).update({ 
        status: novoStatus
    })
    .then( async ()=>{
      let saldoAtual = saldo;
      novoStatus === 'entregue' ? saldoAtual += parseFloat(data.valor) : '';

      await firebase.database().ref('empresas').child(eid)
      .child('saldo').set(saldoAtual);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

 return (
    <Background>
      <Header titulo='Pedidos'/>
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
      </Container>
     
      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color="#FFF" size={30}  />
        </TouchableOpacity>
        <Title>Ultimos Pedidos</Title>
        <AddIcon> 
          <TouchableOpacity onPress={ () => navigation.navigate('Registrar Pedidos') }>
          
              <Icon name="add-box" color="#00b94a" size={30}  />
              
          </TouchableOpacity>
          
        </AddIcon>
        
      </Area>
      
      <List
      showsVerticalScrollIndicator={false}
      data={historico}
      keyExtractor={ item => item.key}
      renderItem={ ({ item }) => ( <PedidosList data={item} deleteItem={handleDelete} updateItemFoward={handleUpdateFoward} updateItemBack={handleUpdateBack} /> )}
      />

      {show && (
        <DatePicker
        onClose={handleClose}
        date={newDate}
        onChange={onChange}
        />
      )}

    </Background>
  );
}