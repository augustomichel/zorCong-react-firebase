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
margin-top: 30px;
font-size: 17px;
`;

export const SubmitButton = styled.TouchableOpacity`
height: 50px;
width: 40%;
margin-top: 20px;
align-items: center;
justify-content: center;
background-color: #00b94a;
margin-left:20px;
margin-right:20px;
`;
export const SubmitText = styled.Text`
font-size: 21px;
font-weight: bold;
color: rgba(255,255,255, 0.9);
`;

export const Area = styled.View`
flex-direction: row;
`;

export const ClienteText = styled.Text`
color: #222;
font-size:22px;
font-weight: bold;
`;

export const Container = styled.View`
margin-bottom: 5px;
padding: 10px;
box-shadow: 2px 2px rgba(0,0,0, 0.40);
background-color: rgba(0,0,0,0.20);
`;

export const IconDel = styled.View`
flex-direction:row;
background-color: #C62c36 ;
padding-bottom: 3px;
padding-top: 3px;
padding-left: 8px;
padding-right: 8px;
border-radius: 7px;
`;

export const List = styled.FlatList.attrs({
    marginHorizontal: 15
})`
    padding-top: 15px;
    background-color: rgba(255,255,255, 0.9);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    margin-left: 8px;
    margin-right: 8px;
    margin-top: 30px;

`;
export const Title = styled.Text`
margin-left: 5px;
color: #00b94a;
margin-bottom: 10px;
text-align:center;
`;