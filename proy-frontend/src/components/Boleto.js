import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { format, parseISO } from 'date-fns';

const Boleto = ({ reserva }) => {

  console.log(reserva);
  
  if (!reserva) return null;

  const { vuelo, cliente, reserva: reservaData, pago } = reserva;
  const { vueloId, fecha, origen, destino } = vuelo;
  const { nombre } = cliente;
  const { asientos, estado } = reservaData;
  const { monto } = pago;

  const fechaFormateada = format(parseISO(fecha), 'dd/MM/yyyy');

  return (
    <Card sx={{ my: 4, padding: 2, backgroundColor: '#e3f2fd' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom align="center" sx={{fontWeight: 'bold'}}>
          Boarding Pass
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1" ><b>Passenger:</b> {nombre}</Typography>
          <Typography variant="body1"><b>Flight:</b> {vueloId}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1"><b>From:</b> {origen}</Typography>
          <Typography variant="body1"><b>To:</b> {destino}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1"><b>Date:</b> {fechaFormateada}</Typography>
          <Typography variant="body1"><b>Seat:</b> {asientos}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1"><b>Amount:</b> S/ {monto.toFixed(2)}</Typography>
          <Typography variant="body1"><b>Status:</b> {estado}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Boleto;