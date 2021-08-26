import React, { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert} from 'react-native';

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth, setLoadingAuth] = useState(false);
  
    useEffect(()=> {
       async function loadStorage(){
           const storageUser = await AsyncStorage.getItem('Auth_user');

           if(storageUser){
               setUser(JSON.parse(storageUser));
               setLoading(false);
           }

           setLoading(false);
       }
       
       loadStorage();
    }, []);

    //Funcao para logar o usario
    async function signIn(email, password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email,password)
        .then(async (value)=>{
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).once('value')
            .then((snapshot)=>{
                let data = {
                  uid: uid,
                  nome: snapshot.val().nome,
                  email: value.user.email,
                  empresa: snapshot.val().empresa
                };
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
            })
        })
        .catch((error)=> {
            
            if(error.code === 'auth/weak-password'){
                Alert.alert('ATENÇÃO','Sua senha deve ter pelo menos 6 caracteres')
            } else
            if(error.code === 'auth/wrong-password'){
                Alert.alert('ATENÇÃO','Sua senha esta incorreta')
            } else
            if(error.code === 'auth/user-not-found'){
                Alert.alert('ATENÇÃO','Usuário não cadastrado'  )
            } else
            if(error.code === 'auth/invalid-email'){
                Alert.alert('ERRO','Email inválido')
            }else {
                Alert.alert('ERRO','Algo deu errado! erro:' + error.code);
            }
            setLoadingAuth(false);
        });
    }
    
    //Cadastrar usuario
    async function signUp(email, password, nome,empresa){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(async (value)=>{
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).set({
                saldo: 0,
                nome: nome,
                empresa: empresa
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    empresa: empresa
                };
                
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
            })
        })
        .catch((error)=> {
            if(error.code === 'auth/email-already-in-use'){
                Alert.alert('ATENÇÃO','Email já cadastrado')
            } else
            if(error.code === 'auth/weak-password'){
                Alert.alert('ATENÇÃO','Sua senha deve ter pelo menos 6 caracteres')
            } else
            if(error.code === 'auth/wrong-password'){
                Alert.alert('ATENÇÃO','Sua senha esta incorreta')
            } else
            if(error.code === 'auth/user-not-found'){
                Alert.alert('ATENÇÃO','Usuário não cadastrado')
            } else
            if(error.code === 'auth/invalid-email'){
                Alert.alert('ERRO','Email inválido')
            }else {
                Alert.alert('ERRO','Algo deu errado! erro:' + error.code);
            }
            
            setLoadingAuth(false);
        });
    }

    async function storageUser(data){
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
    }


    async function signOut(){
        await firebase.auth().signOut();
        await AsyncStorage.clear()
        .then( () => {
           setUser(null); 
        })

    }
    
    return(
     <AuthContext.Provider value={{ signed: !!user , user, loading, signUp, signIn, signOut, loadingAuth }}>
         {children}
     </AuthContext.Provider>   
    );
}

export default AuthProvider;