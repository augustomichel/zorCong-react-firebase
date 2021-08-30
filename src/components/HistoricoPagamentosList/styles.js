import styled from 'styled-components/native';

export const Container = styled.View`
margin-bottom: 5px;
padding: 10px;
box-shadow: 2px 2px rgba(0,0,0, 0.40);
background-color: ${props => 
                    props.tipo === 'Crédito' ? '#049301'  : '#C62c36'}

`;

export const Tipo = styled.View`
flex-direction: row;
margin-left: auto;
margin-right: auto;
`;

export const Del = styled.View`
flex-direction: row-reverse;
text-align: center;
`;
export const Mov = styled.View`
flex-direction: row;
padding-left: 10;
`;
export const IconView = styled.View`
flex-direction:row;
background-color: ${props => 
                    props.status === 'novo' ? '#C62c36' : props.status === 'fazendo' ? '#ffff00' : '#049301'};
padding-bottom: 3px;
padding-top: 3px;
padding-left: 8px;
padding-right: 8px;
border-radius: 7px;
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

export const IconNav = styled.View`
flex-direction:row;
padding-bottom: 3px;
padding-top: 3px;
padding-left: 8px;
padding-right: 8px;
border-radius: 7px;
`;
export const TipoText = styled.Text`
color: #FFF;
font-size: 16px;
font-style: italic;
`;

export const ClienteText = styled.Text`
color: #222;
font-size:16px;
font-weight: bold;
`;

