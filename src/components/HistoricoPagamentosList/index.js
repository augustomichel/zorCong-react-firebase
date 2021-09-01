import React from 'react';


import {Container,  ClienteText} from './styles';

export default function HistoricoPagamentosList({ data, simplificado  }) {
  if (simplificado === 'true'){
    return (
        <Container tipo={data.tipo}>
            
              <ClienteText>
              {data.date} 
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