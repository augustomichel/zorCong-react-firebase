import React, { useContext, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Platform } from 'react-native';
import firebase from '../../services/firebaseConnection';
import { format, isBefore, addDays } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../../contexts/auth';
import { PedidosContext } from '../../contexts/pedidos';

import Header from '../../components/Header';
import PedidosList from '../../components/PedidosList';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

import { Background, Container, Nome, Saldo, Title, List, Area, AddIcon} from './styles';

export default function Home() {
  const { saldo, getSaldo, getPedidos, pedidos ,
          handleUpdateBackSuccess, handleUpdateFowardSuccess,
          handleDeleteSuccess,handlePagarPedido,
          newDate,setNewDate, setKeyPedido} = useContext(PedidosContext);
  const { user } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const navigation = useNavigation();
  
  useEffect(()=>{
    async function loadList(){
      
      getSaldo();
      getPedidos();
    
    }

    loadList();
  }, [newDate]);


  function handleDelete(data){

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

  function pagarPedido(data){
    if (data.pago === 'Sim'){
      Alert.alert(
        'Cuidado Atençao!',    
        `Cancelar pagamento de   ${data.tipo} - Cliente: ${data.cliente}?`,
        [
          {
            text: 'Não',
            style: 'cancel'
          },
          {
            text: 'Sim',
            onPress: () => handlePagarPedido(data)
          }
        ]
      )
    } else {
      Alert.alert(
        'Cuidado Atençao!',    
        `Pedido  ${data.tipo} - Cliente: ${data.cliente} pago?`,
        [
          {
            text: 'Não',
            style: 'cancel'
          },
          {
            text: 'Sim',
            onPress: () => handlePagarPedido(data)
          }
        ]
      )
    }
  }

function handleabreHistorico(data){
  setKeyPedido(data.key);
  navigation.navigate('Historico Pedido');
}

 return (
    <Background>
      <Header titulo='Pedidos'/>   
      <Area>
        <TouchableOpacity onPress={handleShowPicker}>
          <Icon name="event" color="#FFF" size={30}  />
        </TouchableOpacity>
        <Title>Pedidos apartir de {format(newDate, 'dd/MM/yyyy')}</Title>
        <AddIcon> 
          <TouchableOpacity onPress={ () => navigation.navigate('Registrar Pedidos') }>
          
              <Icon name="add-box" color="#00b94a" size={30}  />
              
          </TouchableOpacity>
          
        </AddIcon>
        
      </Area>
      
      <List
      showsVerticalScrollIndicator={false}
      data={pedidos}
      keyExtractor={ item => item.key}
      renderItem={ ({ item }) => ( <PedidosList data={item} pagar={pagarPedido} deleteItem={handleDelete} 
        updateItemFoward={handleUpdateFoward} updateItemBack={handleUpdateBack} 
        abreHistorico={handleabreHistorico} /> )}
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