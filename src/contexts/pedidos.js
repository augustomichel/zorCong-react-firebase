import React, { useState, createContext,useContext } from 'react';
import firebase from '../services/firebaseConnection';
import { Alert , Keyboard} from 'react-native';
import {AuthContext} from './auth';
import { format, addDays } from 'date-fns';
import Moment from "moment";

export const PedidosContext = createContext({});

function PedidosProvider({ children }){
    const { user } = useContext(AuthContext);
    const eid = user && user.empresa;
    const [newDate, setNewDate] = useState(addDays(new Date(),-7));
    const [newDateDesp, setNewDateDesp] = useState(addDays(new Date(),-7));
    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState([]);
    const [saldo, setSaldo] = useState(0);
    const [pedidos, setPedidos] = useState([]);
    const [pedidos1, setPedidos1] = useState([]);
    const [despesas, setDespesas] = useState([]);
    const [historicoPedido,setHistoricoPedido] = useState([]);
    const [historicoPagamentos,setHistoricoPagamentos] = useState([]);
    const [keyPedido, setKeyPedido] = useState([]);
    const [loadingPag, setLoadingPag] = useState(false);

    async function getSaldo(){
        //setLoading(true);    
        await firebase.database().ref('empresas').child(eid).on('value', (snapshot)=>{
            setSaldo(snapshot.val().saldo);
          });   
    }
   
    async function getProdutos(){
      setLoading(true);
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
      setLoading(false);  
    }    
    
    async function getPedidos(){  
      setLoading(true);

      await firebase.database().ref('historico')
      .child(eid)
      //.orderByChild('cliente')
      .orderByChild('date').startAt(Moment(newDate).format())
      .on('value', (snapshot)=>{
        setPedidos([]);
        
        snapshot.forEach((childItem) => {
          let list = {
            key: childItem.key,
            tipo: childItem.val().tipo,
            valor: childItem.val().valor,
            date: childItem.val().date,
            status: childItem.val().status,
            cliente: childItem.val().cliente,
            pago: childItem.val().pago,  
          };
          
          setPedidos(oldArray => [...oldArray, list].reverse());
        })
      })

      setLoading(false);   
      
    }

    async function getDespesas(){  
      setLoading(true);
      
      await firebase.database().ref('despesas')
        .child(eid)
        .orderByChild('datadespesa').startAt(Moment(newDateDesp).format())
        .on('value', (snapshot)=>{
          setDespesas([]);
          
          snapshot.forEach((childItem) => {
            let list = {
              key: childItem.key,             
              valor: childItem.val().valor,
              datadespesa: childItem.val().datadespesa,
              descricao: childItem.val().descricao,
              fornecedor: childItem.val().fornecedor
            };
            
            setDespesas(oldArray => [...oldArray, list]);
          })
        })
      setLoading(false);    
    }

    async function getHistoricoPedido(){   
      setLoading(true);  
      await firebase.database().ref('historicoPedido')
      .child(eid).child(keyPedido + 'histpedido')
      .on('value', (snapshot)=>{
        setHistoricoPedido([]);
        
        snapshot.forEach((childItem) => {
          let list = {
            key: childItem.key ,
            tipo: childItem.val().tipo,
            pedido: childItem.val().pedido,
            statusAnterior: childItem.val().statusAnterior,
            statusnovo: childItem.val().statusnovo,
            date: childItem.val().date,
            pago: childItem.val().pago
          };
          
          setHistoricoPedido(oldArray => [...oldArray, list]);

        })
      })
      setLoading(false);   
    }

    async function getHistoricoPagamentos(completo){     
      setLoading(true);
      if (completo === 'true'){
        await firebase.database().ref('historicoSaldo')
        .child(eid)
        .on('value', (snapshot)=>{
          setHistoricoPagamentos([]);
          
          snapshot.forEach((childItem1) => {
              let list =[];
              childItem1.forEach((childItem) =>{
                //getPedido(childItem.val().pedido);               
                list = {
                  key: childItem.key,
                  tipo: childItem.val().tipo,
                  date: childItem.val().date,
                  valor: childItem.val().valor,
                  cliente: childItem.val().cliente,
                  produto: childItem.val().produto,
                };
                
                setHistoricoPagamentos(oldArray => [...oldArray, list]);
                
              })
          }) 
       })
      }else {      
        await firebase.database().ref('historicoSaldo')
        .child(eid).child(keyPedido + 'histpagamento')
        .on('value', (snapshot)=>{
          setHistoricoPagamentos([]);
          let list =[];
          snapshot.forEach((childItem) => {
            list = {
              key: childItem.key,
              tipo: childItem.val().tipo,
              date: format(new Date(), 'dd/MM/yyyy HH:mm'),
              valor: childItem.val().valor
            };
            
            setHistoricoPagamentos(oldArray => [...oldArray, list]);
          })
        })
      }
      setLoading(false);  
    }

    async function handleAdd(tipo, cliente, valor){
      setLoading(true);
      let key = await firebase.database().ref('historico').child(eid).push().key;
      await firebase.database().ref('historico').child(eid).child(key).set({
        tipo: tipo.nome === undefined ? tipo : tipo.nome,
        valor: parseFloat(valor),
        cliente: cliente,
        status: 'novo',
        date: Moment().format(),
        pago: 'Não'
      }).then( async ()=>{

      let keyNova = await firebase.database().ref('historicoPedido').child(eid).push().key;
      await firebase.database().ref('historicoPedido').child(eid).child(key).child(keyNova).set({
          tipo: "Criado",
          pedido: key,
          statusAnterior: '',
          statusnovo: "Criado",
          date: Moment().format()
        });
      })
      .catch((error)=>{
        alert(error);
      
      });
  
      Keyboard.dismiss();
      setLoading(false);  
    }

    async function handleUpdateFowardSuccess(data){
      setLoading(true);
      let novoStatus = '';
      switch(data.status) { 
        case 'novo':
          novoStatus = 'fazendo';
          break;
        case 'fazendo':
          novoStatus = 'congelando';
          break;
        case 'congelando':
          novoStatus = 'pronto';
          break;
        case 'pronto':
          novoStatus = 'entregue';
          break;
      }
        
      await firebase.database().ref('historico')
      .child(eid).child(data.key).update({ 
          status: novoStatus,
          dateUltAlteracao: Moment().format()
      })
      .then( async ()=>{ 
          registraHistoricoPedido(novoStatus, data, 'próxima');
      })
      .catch((error)=>{
        console.log(error);
        setLoading(false);  
      })
       
    }

    async function handleUpdateBackSuccess(data){
      setLoading(true);
      let novoStatus = '';
      switch(data.status) { 
        case 'entregue':
          novoStatus = 'pronto';
          break;
        case 'congelando':
          novoStatus = 'fazendo';
          break;
        case 'pronto':
          novoStatus = 'congelando';
          break;
        case 'fazendo':
          novoStatus = 'novo';
          break;
      }
    
      await firebase.database().ref('historico')
      .child(eid).child(data.key).update({ 
          status: novoStatus,
          dateUltAlteracao: Moment().format()
      })
      .then( async ()=>{      
         registraHistoricoPedido(novoStatus, data, 'anterior' );
      })
      .catch((error)=>{
        console.log(error);
        setLoading(false);  
      })
      
    }


    async function registraHistoricoPedido(novoStatus, data, tipoAlt){       
      let key = await firebase.database().ref('historicoPedido').child(eid).push().key;
      await firebase.database().ref('historicoPedido').child(eid).child(data.key + 'histpedido').child(key).set({
        tipo: tipoAlt,
        pedido: data.key,
        statusAnterior: data.status,
        statusnovo: novoStatus,
        date: Moment().format()
      });
      setLoading(false);    
    }
    
    async function atualizasaldo(saldoAtual, data, tipoAlt){ 
      await firebase.database().ref('empresas').child(eid)
      .child('saldo').set(saldoAtual)
      .then( async ()=>{
          let key = await firebase.database().ref('historicoSaldo').child(eid).push().key;
          await firebase.database().ref('historicoSaldo').child(eid).child(data.key + 'histpagamento').child(key).set({
              tipo: tipoAlt,
              pedido: data.key,
              valorAnterior: parseFloat(data.valor),
              valornovo: parseFloat(saldoAtual),
              cliente: data.cliente,
              valor: data.valor,
              produto: data.tipo,
              date: Moment().format()    
          })
          .then (async ()=>{
              if (tipoAlt === 'Crédito'){
                  atualizaPedido(data,'Sim')
              } else {
                  atualizaPedido(data,'Nao')
              }
          }).catch((error)=>{
            console.log('atualizasaldo ' + error);
            setLoading(false); 
            setLoadingPag(false); 
          })
      });
        
    }

    async function atualizaPedido(data,status){      
      await firebase.database().ref('historico')
      .child(eid).child(data.key).update({
          pago: status,          
      })    
      .catch((error)=>{
        console.log('atualizaPedido ' + error);
        setLoading(false);
        setLoadingPag(false);
      })
      setLoading(false);
      setLoadingPag(false);
    }

    async function handleDeleteSuccess(data){
      setLoading(true);
      await firebase.database().ref('historico')
      .child(eid).child(data.key).remove()
      .then( async ()=>{
        let saldoAtual = saldo;
        if (data.pago === 'Sim'){
            saldoAtual -= parseFloat(data.valor);
            atualizasaldo(saldoAtual, data, 'Débito Exclusão');
        }   
      })
      .catch((error)=>{
        console.log(error);
        setLoading(false);
      })
      setLoading(false);
    }

    async function handleDeleteDespSuccess(data){
      setLoading(true);
      await firebase.database().ref('despesas')
      .child(eid).child(data.key).remove()
      .then( async ()=>{
        setSaldo(0);
        getSaldo();
        let saldoAtual = saldo;
        saldoAtual += parseFloat(data.valor);

        await firebase.database().ref('empresas').child(eid)
          .child('saldo').set(saldoAtual)         
      })
      .catch((error)=>{
        console.log(error);
        setLoading(false);
      })
      setLoading(false);
    }

    async function handlePagarPedido(data){
      setLoadingPag(true);
      setSaldo(0);
      getSaldo();
      let saldoAtual = saldo;
      
      if (data.pago === 'Sim'){
          saldoAtual -= parseFloat(data.valor);       
          atualizasaldo(saldoAtual, data, 'Débito Cancelamento');
      } else {
          saldoAtual += parseFloat(data.valor);
          atualizasaldo(saldoAtual, data, 'Crédito');
      }
     
    }

    async function handleAddDesp(descricao, data,fornecedor, valor){
      setLoading(true);
   
      let key = await firebase.database().ref('despesas').child(eid).push().key;
      await firebase.database().ref('despesas').child(eid).child(key).set({
        valor: parseFloat(valor),
        descricao: descricao,
        fornecedor: fornecedor,
        datadespesa: Moment(data).format(),
        dateInclusao: Moment().format(),
      }).then( async ()=>{
          setSaldo(0);
          getSaldo();
          let saldoAtual = saldo; 
          saldoAtual -= parseFloat(valor); 
          await firebase.database().ref('empresas').child(eid)
          .child('saldo').set(saldoAtual)
      })
      .catch((error)=>{
        alert(error);
        
      });
  
      Keyboard.dismiss();
      setLoading(false);  
    }

    return(
     <PedidosContext.Provider value={{  getSaldo,getProdutos,getPedidos, 
                handleUpdateBackSuccess, handleUpdateFowardSuccess,
                setNewDate,handleDeleteSuccess,
                handleAdd,handleAddDesp,handlePagarPedido,
                setHistoricoPedido,setKeyPedido,
                getHistoricoPedido,getHistoricoPagamentos,
                setLoading,getDespesas,handleDeleteDespSuccess,
                saldo , produtos, pedidos, newDate, 
                historicoPedido, despesas,
                historicoPagamentos, keyPedido, 
                loading, loadingPag,newDateDesp, setNewDateDesp}}>
         {children}
     </PedidosContext.Provider>   
    );
}

export default PedidosProvider;