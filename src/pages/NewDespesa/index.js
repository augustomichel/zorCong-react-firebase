import React, { useState, useContext,useEffect, Component } from 'react';
import { SafeAreaView, Keyboard, TouchableWithoutFeedback,TextInput, TouchableOpacity,Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PedidosContext } from '../../contexts/pedidos';
import { format } from 'date-fns';

import Header from '../../components/Header';
import { Background, Input, SubmitButton, SubmitText, PickerView,Container, Area} from './styles';

import DatePicker from '../../components/DatePicker';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default function NewDespesa() {
  
 const navigation = useNavigation();
 const { handleAddDesp } = useContext(PedidosContext);
 const [valor, setValor] = useState('');
 const [descricao, setDescricao] = useState('');
 const [fornecedor, setFornecedor] = useState('');
 const [data, setData] = useState(format(new Date(), 'dd/MM/yyyy'));
 const [dataDefault, setDataDefault] = useState(new Date());
 const [show, setShow] = useState(false);

function handleSubmit(){
  Keyboard.dismiss();
 
  if(isNaN(parseFloat(valor)) || descricao === ''  || data === '' || fornecedor === ''){
    alert('Preencha todos os campos!');
    return;
  }

  Alert.alert(
    'Confirmando dados',
    `${descricao} - Valor: ${parseFloat(valor)} - ${data} `,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => ( handleAddDesp(descricao, dataDefault,fornecedor, valor), navigation.navigate('Despesas'))
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
  setShow(false);
  setDataDefault(date);
 
  setData(format(date, 'dd/MM/yyyy'));
 
} 

 return (
   <TouchableWithoutFeedback onPress={ () => Keyboard.dismiss() }>
   <Background>
       <Header titulo="Cadastro de Despesas"/>

       <SafeAreaView style={{ alignItems: 'center' }}>
       <Input
         placeholder="Descricao"
         keyboardType="default"
         //returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={descricao}
         onChangeText={ (text) => setDescricao(text) }
        />
        <Input
         placeholder="Fornecedor"
         keyboardType="default"
         //returnKeyType="next"
         onSubmitEditing={ () => Keyboard.dismiss() }
         value={fornecedor}
         onChangeText={ (text) => setFornecedor(text) }
        />
        <Area>
          <Input
          placeholder="Data"
          keyboardType="numeric"
          //returnKeyType="next"
          onSubmitEditing={ () => Keyboard.dismiss() }
          value={data.toString()}
          //onChangeText={ (text) => setDescricao(text) }
          />
          <Container>
            <TouchableOpacity onPress={handleShowPicker}>    
              <Icon name="event" color="#FFF" size={40}  />
            </TouchableOpacity>
          </Container>
        </Area>

         {show && ( 
        <DatePicker
          onClose={handleClose}
          date={dataDefault}
          onChange={onChange}
                    />
         )}

        <Input
         placeholder="Valor"
         keyboardType="numeric"
         //returnKeyType="next"
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