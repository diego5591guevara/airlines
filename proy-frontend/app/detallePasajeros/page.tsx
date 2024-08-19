"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import styles from "./detallePasajeros.module.css";

const DetallePasajeros = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pasajerosCount = parseInt(searchParams.get("pasajeros"), 10);
  const [pasajeros, setPasajeros] = useState([]);

  useEffect(() => {
    const initialPasajeros = [];
    for (let i = 0; i < pasajerosCount; i++) {
      initialPasajeros.push({
        nombre: "",
        apellido: "",
        documento: "",
        tipoDocumento: "",
      });
    }
    setPasajeros(initialPasajeros);
    setLoading(false);
  }, [pasajerosCount]);

  const handleChange = (index, field, value) => {
    const updatedPasajeros = [...pasajeros];
    updatedPasajeros[index][field] = value;
    setPasajeros(updatedPasajeros);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vueloIda = searchParams.get("ida");
    const vueloVuelta = searchParams.get("vuelta");

    const serializedPasajeros = JSON.stringify(pasajeros);
    const encryptedPasajeros = CryptoJS.AES.encrypt(
      serializedPasajeros,
      "airlines"
    ).toString();

    router.push(
      `/resumenReserva?ida=${vueloIda}&vuelta=${vueloVuelta}&pasajeros=${encodeURIComponent(
        encryptedPasajeros
      )}`
    );
  };

  const handleRegresar = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <img
          src="/loading.gif"
          alt="Cargando..."
          className={styles.loadingGif}
        />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.pasajerosContainer}>
      <div>
        <div className={styles.sidebarLeft}>
          <h3>Resumen del Vuelo</h3>
          <div className={styles.flightGroup}>
            <h4>Vuelo de Ida</h4>
            <p>
              <strong>Origen:</strong> LIM
            </p>
            <p>
              <strong>Destino:</strong> CUZ
            </p>
            <p>
              <strong>Salida:</strong> 10:30
            </p>
            <p>
              <strong>Llegada:</strong> 12:00
            </p>
            <p>
              <strong>Precio:</strong> USD 150
            </p>
          </div>
          <div className={styles.flightGroup}>
            <h4>Vuelo de Vuelta</h4>
            <p>
              <strong>Origen:</strong> CUZ
            </p>
            <p>
              <strong>Destino:</strong> LIM
            </p>
            <p>
              <strong>Salida:</strong> 15:00
            </p>
            <p>
              <strong>Llegada:</strong> 16:30
            </p>
            <p>
              <strong>Precio:</strong> USD 145
            </p>
          </div>
        </div>
        <div className={styles.sidebarLeft}>
          <h3>Servicios Adicionales</h3>
          <ul className={styles.servicesList}>
            <li>Equipaje extra</li>
            <li>Seguro de viaje</li>
            <li>Selección de asientos</li>
          </ul>
        </div>
      </div>
      <div className={styles.formContainer}>
        <h1>Detalles de Pasajeros</h1>
        <form onSubmit={handleSubmit}>
          {pasajeros.map((pasajero, index) => (
            <div key={index} className={styles.pasajeroCard}>
              <h2>Pasajero - {index + 1}</h2>
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Nombres</label>
                  <input
                    className={styles.inputText}
                    type="text"
                    value={pasajero.nombre}
                    onChange={(e) =>
                      handleChange(index, "nombre", e.target.value)
                    }
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Apellidos</label>
                  <input
                    className={styles.inputText}
                    type="text"
                    value={pasajero.apellido}
                    onChange={(e) =>
                      handleChange(index, "apellido", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Tipo de documento</label>
                  <select
                    className={styles.selectDropdown}
                    value={pasajero.tipoDocumento}
                    onChange={(e) =>
                      handleChange(index, "tipoDocumento", e.target.value)
                    }
                    required
                  >
                    <option value="DNI/C.I.">DNI/C.I.</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Documento</label>
                  <input
                    className={styles.inputText}
                    type="text"
                    value={pasajero.documento}
                    onChange={(e) =>
                      handleChange(index, "documento", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={`${styles.button} ${styles.regresarButton}`}
              onClick={handleRegresar}
            >
              Regresar
            </button>
            <button type="submit" className={styles.button}>
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetallePasajeros;
