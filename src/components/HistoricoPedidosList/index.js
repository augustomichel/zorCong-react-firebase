import React from 'react';
import Moment from "moment";

import {Container, Tipo, IconView, TipoText, ClienteText, Del, IconDel, IconNav, Mov} from './styles';

export default function HistoricoPedidosList({ data  }) {
 return (
    <Container>
        
          <ClienteText>
          {Moment(data.date).format('DD/MM/yyyy HH:mm')} 
          </ClienteText>
          <ClienteText>
          {data.statusnovo} 
          </ClienteText>   
    </Container>
    
  );
}