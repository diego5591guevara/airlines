import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import Boleto from "./components/Boleto";

const Proceso = () => {
  const [obj, setObj] = useState({
    vueloId: "",
    clienteId: "",
    asientos: "",
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [vuelos, setVuelos] = useState([]);
  const [reserva, setReserva] = useState(null);

  const listaVuelos = async () => {
    try {
      const res = await axios.get("http://localhost:3001/vuelos");
      setVuelos(res.data);
    } catch (error) {
      console.error("Error de listado de vuelo:", error);
    }
  };

  useEffect(() => {
    listaVuelos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setObj({ ...obj, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const asientoArr = obj.asientos;
    try {
      const res = await axios.post(
        "http://localhost:4000/orchestrator/proceso",
        { ...obj, asientos: asientoArr }
      );

      if (res.data.response === "success") {
        setResponse(res.data.message);

        setReserva({
            vuelo: res.data.vuelo,
            cliente: res.data.cliente,
            reserva: res.data.reserva,
            pago: res.data.pago
        });
        //setReserva(res.data.cliente);
        setError(null);
        listaVuelos();
      } else {
        setResponse(null);
        setReserva(null);
        setError(res.data.message);
      }
    } catch (error) {
      setError(
        error.response ? error.response.data.message : "Ocurrió un error"
      );
      setResponse(null);
      setReserva(null);
    }
  };

  const formatMoneda = (value) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Listado de Vuelos
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID del Vuelo</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Asientos</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vuelos.map((vuelo) => (
                <TableRow key={vuelo.vueloId}>
                  <TableCell>{vuelo.vueloId}</TableCell>
                  <TableCell>{vuelo.origen}</TableCell>
                  <TableCell>{vuelo.destino}</TableCell>
                  <TableCell>
                    {format(parseISO(vuelo.fecha), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{vuelo.asientos}</TableCell>
                  <TableCell>{formatMoneda(Number(vuelo.precio))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reserva/Pago de Vuelo
        </Typography>
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Vuelo ID"
                name="vueloId"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Cliente ID"
                name="clienteId"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Asientos (separado por comas)"
                name="asientos"
                type="number"
                variant="outlined"
                margin="normal"
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                fullWidth
              >
                Procesar
              </Button>
            </form>
            {response && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="success">{response}</Alert>
              </Box>
            )}
            {error && (
              <Box sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}
          </CardContent>
        </Card>
        {reserva && <Boleto reserva={reserva} />}
      </Box>
    </Container>
  );
};

export default Proceso;
