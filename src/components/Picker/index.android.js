import React, {useState} from 'react';
import {Picker as RNPickerSelect} from '@react-native-picker/picker';
import { PickerView } from './styles';

export default function Picker({ onChange, tipo, produtos }){
    
    return(
        <PickerView>
            <RNPickerSelect
            style={{
               width: '100%'
            }}
            selectedValue={tipo}

            onValueChange={ (valor) => onChange(valor)  } 
            
            >
            
                {produtos.map((item) => {
                    return ( 
                    <RNPickerSelect.Item
                        key={item.key}
                        label={item.nome}
                        value={item}
                    
                        />
                    );
                   
                })}
                
            </RNPickerSelect>
        </PickerView>

        
    )
}