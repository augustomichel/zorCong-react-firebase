import styled from 'styled-components/native';

export const Background = styled.View`
flex:1;
background-color: #131313;
`;
export const Input = styled.TextInput.attrs({
    placeholderTextColor: '#222'
})`
height: 50px;
width: 90%;
background-color: rgba(255,255,255, 0.9);
margin-top: 20px;
font-size: 17px;
`;

export const Area = styled.View`
    flex-direction: row;
    width: 90%;
`;

export const Container = styled.View`
   margin-top: 25px; 
`;

export const SubmitButton = styled.TouchableOpacity`
height: 50px;
width: 90%;
margin-top: 20px;
align-items: center;
justify-content: center;
background-color: #00b94a;
`;
export const SubmitText = styled.Text`
font-size: 21px;
font-weight: bold;
color: rgba(255,255,255, 0.9);
`;

export const PickerView = styled.View`
margin-top: 20px;
background-color: rgba(255,255,255, 0.9);;
align-items: center;
width: 90%;
height: auto;
color: black;
`;

