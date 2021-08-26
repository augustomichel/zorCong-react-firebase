import React from 'react';


import {Container, Tipo, IconView, TipoText, ClienteText, Del, IconDel, IconNav, Mov} from './styles';

export default function HistoricoPedidosList({ data  }) {
 return (
    <Container>
        
          <ClienteText>
          {data.date} 
          </ClienteText>
          <ClienteText>
          {data.statusnovo} 
          </ClienteText>   
    </Container>
    
  );
}