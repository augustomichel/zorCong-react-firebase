import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { PickerView } from './styles';

export default function Picker({ onChange }){
    return(
        <PickerView>
            <RNPickerSelect
            style={{
                inputIOS:{
                    height: 50,
                    padding: 5,
                    backgroundColor: '#FFF',
                    fontSize: 16
                }
            }}
            placeholder={{
                label: 'Selecione o tipo',
                color: '#222',
                value: null,
            }}
            onValueChange={ (tipo) => onChange(tipo) }
            items={[
                {label: 'Agnoline Frango', value: 'Agnoline Frango', color: '#222'},
                {label: 'Agnoline Carne', value: 'Agnoline Carne', color: '#222'},
                {label: 'Tortei Calabresa', value: 'Tortei Calabresa', color: '#222'},
                {label: 'Tortei Abobora', value: 'Tortei Abobora', color: '#222'},
            ]}
            />
        </PickerView>
    )
}