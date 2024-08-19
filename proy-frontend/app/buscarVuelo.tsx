"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./buscarVuelo.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autosuggest from "react-autosuggest";
import { fetchCiudades } from "../services/ciudadService";

const BuscarVuelo = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const today = new Date();

  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [origenDisplay, setOrigenDisplay] = useState(""); 
  const [destinoDisplay, setDestinoDisplay] = useState(""); 
  const [suggestionsOrigen, setSuggestionsOrigen] = useState([]);
  const [suggestionsDestino, setSuggestionsDestino] = useState([]);
  const [pasajeros, setPasajeros] = useState(1);
  const router = useRouter();

  const handlePasajerosChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasajeros(Number(event.target.value));
  };

  const handleDateChange = (dates: [Date | null, Date | null] | null) => {
    if (dates) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    }
  };

  const searchParams = new URLSearchParams({
    origen: origen,
    destino: destino,
    ida: startDate?.toISOString() || '',
    vuelta: endDate?.toISOString() || '',
    pasajeros: String(pasajeros)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/resultadosVuelos?${searchParams.toString()}`);
  };

  const onSuggestionsFetchRequestedOrigen = async ({
    value,
  }: {
    value: string;
  }) => {
    try {
      const cities = await fetchCiudades(value);
      setSuggestionsOrigen(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const onSuggestionsFetchRequestedDestino = async ({
    value,
  }: {
    value: string;
  }) => {
    try {
      const cities = await fetchCiudades(value);
      setSuggestionsDestino(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const onSuggestionsClearRequestedOrigen = () => {
    setSuggestionsOrigen([]);
  };

  const onSuggestionsClearRequestedDestino = () => {
    setSuggestionsDestino([]);
  };

  const onChangeOrigen = (event: any, {  newValue, suggestion }: any) => {
    console.log(newValue);
    console.log(suggestion);
    if (suggestion) {
      setOrigen(suggestion.aeropuertos[0].codigo);
      //setOrigen(`${suggestion.ciudad}, ${suggestion.aeropuertos[0].nombre} (${suggestion.aeropuertos[0].codigo})`); 
      setOrigenDisplay(`${suggestion.ciudad}, ${suggestion.aeropuertos[0].nombre} (${suggestion.aeropuertos[0].codigo})`); 
    } else {      
      setOrigen(newValue);
      setOrigenDisplay(newValue);
    }
  };

  const onChangeDestino = (event: any, { newValue, suggestion }: any) => {
    if (suggestion) {
      setDestino(suggestion.aeropuertos[0].codigo);
      setDestinoDisplay(`${suggestion.ciudad}, ${suggestion.aeropuertos[0].nombre} (${suggestion.aeropuertos[0].codigo})`); 
    } else {
      setDestino(newValue);
      setDestinoDisplay(newValue);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.form} onSubmit={handleSearch}>
        <div className={styles.field}>
          <label htmlFor="from">Origen</label>
          <Autosuggest
            suggestions={suggestionsOrigen}
            onSuggestionsFetchRequested={onSuggestionsFetchRequestedOrigen}
            onSuggestionsClearRequested={onSuggestionsClearRequestedOrigen}
            //getSuggestionValue={(suggestion) => suggestion.aeropuertos[0].codigo + " (" + suggestion.pais + ")"}
            getSuggestionValue={(suggestion) => suggestion.aeropuertos[0].codigo}
            renderSuggestion={(suggestion) => (
              <div>
                <strong>{suggestion.ciudad}</strong> -{" "}
                {suggestion.aeropuertos[0].nombre} (
                {suggestion.aeropuertos[0].codigo})
              </div>
            )}
            inputProps={{
              placeholder: "Ciudad de origen",
              value: origen,
              onChange: onChangeOrigen,
            }}
            theme={{
              suggestionsContainerOpen: styles.suggestionsContainerOpen,
              suggestionsList: styles.suggestionsList,
              suggestion: styles.suggestion,
              suggestionHighlighted: styles.suggestionHighlighted,
            }}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="to">Destino</label>
          <Autosuggest
            suggestions={suggestionsOrigen}
            onSuggestionsFetchRequested={onSuggestionsFetchRequestedOrigen}
            onSuggestionsClearRequested={onSuggestionsClearRequestedOrigen}
            //getSuggestionValue={(suggestion) => suggestion.aeropuertos[0].codigo + " (" + suggestion.pais + ")"}
            getSuggestionValue={(suggestion) => suggestion.aeropuertos[0].codigo}
            renderSuggestion={(suggestion) => (
              <div>
                <strong>{suggestion.ciudad}</strong> -{" "}
                {suggestion.aeropuertos[0].nombre} (
                {suggestion.aeropuertos[0].codigo})
              </div>
            )}
            inputProps={{
              placeholder: "Ciudad de destino",
              value: destino,
              onChange: onChangeDestino,
            }}
            theme={{
              suggestionsContainerOpen: styles.suggestionsContainerOpen,
              suggestionsList: styles.suggestionsList,
              suggestion: styles.suggestion,
              suggestionHighlighted: styles.suggestionHighlighted,
            }}
          />
        </div>
        <div className={styles.field} style={{ position: "static" }}>
          <label htmlFor="departure">Fecha Ida y Vuelta</label>
          <div className={styles.datePickerContainer}>
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              minDate={today}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              placeholderText="Selecciona un rango de fechas"
              dateFormat="dd/MM/yyyy"
              className={styles.datePicker}
              monthsShown={2}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label htmlFor="pasajeros">Pasajeros</label>
          <input
            type="number"
            id="pasajeros"
            name="pasajeros"
            min="1"
            max="99"
            value={pasajeros}
            onChange={handlePasajerosChange}
            className={styles.inputNumber}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          type="submit"
          className={styles.submitButton}       
        >
          Buscar vuelo
        </button>
      </form>
    </div>
  );
};

export default BuscarVuelo;
