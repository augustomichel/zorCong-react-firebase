import React from 'react';
import Moment from "moment";

import {Container,  ClienteText} from './styles';

export default function HistoricoPagamentosList({ data, simplificado  }) {
  if (simplificado === 'true'){
    return (
        <Container tipo={data.tipo}>
            
              <ClienteText>
              {Moment(data.date).format('DD/MM/yyyy HH:mm')}
              </ClienteText>
              <ClienteText>
              Valor: R$ {data.valor} 
              </ClienteText>   
        </Container>
        
      );
  } else {
    return (
      <Container tipo={data.tipo}>
            <ClienteText>
              {data.cliente}
            </ClienteText>
            <ClienteText>
              {data.produto}
            </ClienteText>
            <ClienteText>
              {data.date} 
            </ClienteText>
            <ClienteText>
              R$ {data.valor} 
            </ClienteText>   
      </Container>
      
    );
  }
}