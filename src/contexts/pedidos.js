import React, { useState, createContext,useContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { Alert , Keyboard} from 'react-native';
import {AuthContext} from './auth';
import { format, isBefore, addDays } from 'date-fns';

export const PedidosContext = createContext({});

function PedidosProvider({ children }){
    const { user } = useContext(AuthContext);
    const eid = user && user.empresa;
    const [newDate, setNewDate] = useState(addDays(new Date(),-7));

    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [pedidos, setPedidos] = useState([]);
    const [historicoPedido,setHistoricoPedido] = useState([]);
    const [keyPedido, setKeyPedido] = useState([]);

    //Funcao para logar o usario
    async function getSaldo(){    
        await firebase.database().ref('empresas').child(eid).on('value', (snapshot)=>{
            setSaldo(snapshot.val().saldo);
          });
    }
   
    async function getProdutos(){
        
        await firebase.database().ref('produtos').child(eid)
            .on('value', (snapshot)=>{
            setProdutos([]);
            
            snapshot.forEach((childItem) => {
            let list = {
                nome: childItem.val().nome,
                valor: childItem.val().valor,
            };
            
            setProdutos(oldArray => [...oldArray, list].reverse());
            
            })
        })   
    }    
    
    async function getPedidos(){       
        await firebase.database().ref('historico')
        .child(eid)
        .orderByChild('date').startAt(format(newDate, 'dd/MM/yyyy'))
        .limitToLast(20).on('value', (snapshot)=>{
            setPedidos([]);
          
          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              valor: childItem.val().valor,
              date: childItem.val().date,
              status: childItem.val().status,
              cliente: childItem.val().cliente,
              pago: childItem.val().pago
            };
            
            setPedidos(oldArray => [...oldArray, list].reverse());
          })
        })
    }

    async function getHistoricoPedido(){     
        await firebase.database().ref('historicoPedido')
        .child(eid).child(keyPedido)
        .on('value', (snapshot)=>{
            setHistoricoPedido([]);
          
          snapshot.forEach((childItem) => {
            let list = {
              tipo: childItem.val().tipo,
              pedido: childItem.val().pedido,
              statusAnterior: childItem.val().statusAnterior,
              statusnovo: childItem.val().statusnovo,
              date: childItem.val().date,
              pago: childItem.val().pago
            };
            
            setHistoricoPedido(oldArray => [...oldArray, list].reverse());
          })
        })
    }

    async function handleAdd(tipo, cliente, valor){
         let key = await firebase.database().ref('historico').child(eid).push().key;
         await firebase.database().ref('historico').child(eid).child(key).set({
           tipo: tipo.nome === undefined ? tipo : tipo.nome,
           valor: parseFloat(valor),
           cliente: cliente,
           status: 'novo',
           date: format(new Date(), 'dd/MM/yyyy HH:mm'),
           pago: 'Não'
         }).then( async ()=>{

            let keyNova = await firebase.database().ref('historicoPedido').child(eid).push().key;
            await firebase.database().ref('historicoPedido').child(eid).child(key).child(keyNova).set({
                tipo: "Criado",
                pedido: key,
                statusAnterior: '',
                statusnovo: "Criado",
                date: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
            });
          })
          .catch((error)=>{
            alert(error);
          });
     
         Keyboard.dismiss();
 
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
            status: novoStatus,
            dateUltAlteracao: format(new Date(), 'dd/MM/yyyy HH:mm')
        })
        .then( async ()=>{ 
           registraHistoricoPedido(novoStatus, data, 'próxima');
        })
        .catch((error)=>{
          console.log(error);
        })
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
          status: novoStatus,
          dateUltAlteracao: format(new Date(), 'dd/MM/yyyy HH:mm')
      })
      .then( async ()=>{      
         registraHistoricoPedido(novoStatus, data, 'anterior' );
      })
      .catch((error)=>{
        console.log(error);
      })
    }


    async function registraHistoricoPedido(novoStatus, data, tipoAlt){    
        let key = await firebase.database().ref('historicoPedido').child(eid).push().key;
        await firebase.database().ref('historicoPedido').child(eid).child(data.key).child(key).set({
          tipo: tipoAlt,
          pedido: data.key,
          statusAnterior: data.status,
          statusnovo: novoStatus,
          date: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
        });
    }
    
    async function atualizasaldo(saldoAtual, data, tipoAlt){
        
        await firebase.database().ref('empresas').child(eid)
        .child('saldo').set(saldoAtual)
        .then( async ()=>{
            let key = await firebase.database().ref('historicoSaldo').child(eid).push().key;
            await firebase.database().ref('historicoSaldo').child(eid).child(data.key).child(key).set({
                tipo: tipoAlt,
                pedido: data.key,
                valorAnterior: parseFloat(data.valor),
                valornovo: parseFloat(saldoAtual),
                cliente: data.cliente,
                date: format(new Date(), 'dd/MM/yyyy HH:mm:ss')     
            })
            .then (async ()=>{
                if (tipoAlt === 'Crédito'){
                    atualizaPedido(data,'Sim')
                } else {
                    atualizaPedido(data,'Nao')
                }
            })
        });
    }

    async function atualizaPedido(data,status){
        await firebase.database().ref('historico')
      .child(eid).child(data.key).update({
          pago: status,          
      })    
      .catch((error)=>{
        console.log(error);
      })
    }

    async function handleDeleteSuccess(data){
        await firebase.database().ref('historico')
        .child(eid).child(data.key).remove()
        .then( async ()=>{
        let saldoAtual = saldo;
        if (data.status === 'entregue'){
            saldoAtual -= parseFloat(data.valor);
            atualizasaldo(saldoAtual, data, 'Débito Exclusão');
        }   
        })
        .catch((error)=>{
        console.log(error);
        })
    }

    async function handlePagarPedido(data){
        let saldoAtual = saldo;
        if (data.pago === 'Sim'){
            saldoAtual -= parseFloat(data.valor);
            atualizasaldo(saldoAtual, data, 'Débito Cancelamento');
        } else {
            saldoAtual += parseFloat(data.valor);
            atualizasaldo(saldoAtual, data, 'Crédito');
        }
    }

    return(
     <PedidosContext.Provider value={{  getSaldo,getProdutos,getPedidos, 
                handleUpdateBackSuccess, handleUpdateFowardSuccess,setNewDate,handleDeleteSuccess,
                handleAdd,handlePagarPedido,setHistoricoPedido,setKeyPedido,
                getHistoricoPedido,
                saldo , produtos, pedidos, newDate, historicoPedido,keyPedido}}>
         {children}
     </PedidosContext.Provider>   
    );
}

export default PedidosProvider;