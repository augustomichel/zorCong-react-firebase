import React, { useContext, useState, useEffect } from 'react';
import { Alert, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';

import { format,addDays } from 'date-fns';
import { useNavigation } from '@react-navigation/native';

import { PedidosContext } from '../../contexts/pedidos';

import Header from '../../components/Header';
import DespesasList from '../../components/DespesasList';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

import { Background,  Title, List, Area, AddIcon} from './styles';

export default function Despesa() {
  
const {  despesas, loading, getDespesas, newDateDesp, setNewDateDesp,
        handleDeleteDespSuccess } = useContext(PedidosContext);
const [show, setShow] = useState(false);


const navigation = useNavigation();

useEffect(()=>{
    
  async function loadList(){  
   
    getDespesas();
  
  }
 
  loadList();
  
}, [newDateDesp]);

 function handleShowPicker(){
  setShow(true);
}

function handleClose(){
  setShow(false);
  
}

const onChange = (date) => {
  setShow(Platform.OS === 'ios');
  setNewDateDesp(date);

} 

function handleDelete(data){
  Alert.alert(
    'Cuidado Atençao!',
    `Você deseja excluir ${data.descricao} - Valor: ${data.valor}`,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => handleDeleteDespSuccess(data)
      }
    ]
  )
}

 return (

   <Background>
       <Header titulo="Despesas"/>

       <Area>
        <TouchableOpacity onPress={handleShowPicker}>
        
          
            <Icon name="event" color="#FFF" size={30}  />
          </TouchableOpacity>
          <Title>Pedidos apartir de {format(newDateDesp, 'dd/MM/yyyy')}</Title>
          <AddIcon> 
            <TouchableOpacity onPress={ () => navigation.navigate('Cadastrar Despesa') }>
            
                <Icon name="add-box" color="#00b94a" size={30}  />
                
            </TouchableOpacity>
            
          </AddIcon>

        </Area>
        { loading ? 
            <List
            showsVerticalScrollIndicator={false}
            data={'a'}
            keyExtractor={ item => item.key + 'loading'}
            renderItem={({ item }) => ( <ActivityIndicator size={40} color="#111" />  )}
        
            />
            : 
              <List
              showsVerticalScrollIndicator={false}
              data={despesas}
              keyExtractor={ item => item.key}
              renderItem={ ({ item }) => ( <DespesasList data={item} deleteItem={handleDelete} /> )}
              /> 
            }
      {show && (
        <DatePicker
        onClose={handleClose}
        date={newDateDesp}
        onChange={onChange}
        />
      )}

   </Background>

  );
}