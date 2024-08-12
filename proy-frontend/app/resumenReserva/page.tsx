"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./resumenReserva.module.css";
import axios from "axios";
import CryptoJS from "crypto-js";

const ResumenReserva = () => {
  const searchParams = useSearchParams();
  const hasFetchedData = useRef(false);
  const router = useRouter();
  const [vuelos, setVuelos] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingPay, setLoadingPay] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [objPro, setObjPro] = useState(null);
  const [showModalError, setShowModalError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const vueloIda = searchParams.get("ida");
    const vueloVuelta = searchParams.get("vuelta");
    const encryptedPasajeros = searchParams.get("pasajeros");

    const bytes = CryptoJS.AES.decrypt(encryptedPasajeros, "airlines");
    const pasajeros = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const fetchVuelosDetalle = async () => {
      try {
        const responseIda = await axios.get(
          "http://localhost:3001/vuelos/buscarVuelo",
          {
            params: {
              id: vueloIda,
            },
          }
        );

        const responseVuelta = await axios.get(
          "http://localhost:3001/vuelos/buscarVuelo",
          {
            params: {
              id: vueloVuelta,
            },
          }
        );

        const vuelosConsultados = {
          ida: {
            origen:
              responseIda.data[0].ciudadori +
              " (" +
              responseIda.data[0].origen +
              ")",
            destino:
              responseIda.data[0].ciudadlle +
              " (" +
              responseIda.data[0].destino +
              ")",
            fecha:
              new Date(
                new Date(responseIda.data[0].fecha).setDate(
                  new Date(responseIda.data[0].fecha).getDate() + 1
                )
              ).toLocaleDateString("es-ES", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) +
              " " +
              responseIda.data[0].horaSalida +
              " hrs",
            subtotal: responseIda.data[0].precio * pasajeros.length,
          },
          vuelta: {
            origen:
              responseVuelta.data[0].ciudadori +
              " (" +
              responseVuelta.data[0].origen +
              ")",
            destino:
              responseVuelta.data[0].ciudadlle +
              " (" +
              responseVuelta.data[0].destino +
              ")",
            fecha:
              new Date(
                new Date(responseVuelta.data[0].fecha).setDate(
                  new Date(responseVuelta.data[0].fecha).getDate() + 1
                )
              ).toLocaleDateString("es-ES", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) +
              " " +
              responseVuelta.data[0].horaSalida +
              " hrs",
            subtotal: responseVuelta.data[0].precio * pasajeros.length,
          },
          pasajero: pasajeros.length,
          impuestos: {
            tasa:
              (responseIda.data[0].precio * pasajeros.length +
                responseVuelta.data[0].precio * pasajeros.length) *
              0.16,
            impsalida:
              (responseIda.data[0].precio * pasajeros.length +
                responseVuelta.data[0].precio * pasajeros.length) *
              0.18,
            subtotal:
              (responseIda.data[0].precio * pasajeros.length +
                responseVuelta.data[0].precio * pasajeros.length) *
                0.16 +
              (responseIda.data[0].precio * pasajeros.length +
                responseVuelta.data[0].precio * pasajeros.length) *
                0.18,
          },
        };

        setVuelos(vuelosConsultados);
        setTotal(
          vuelosConsultados.ida.subtotal +
            vuelosConsultados.vuelta.subtotal +
            vuelosConsultados.impuestos.subtotal
        );

        const newObjPro = {
          origen: vueloIda,
          destino: vueloVuelta,
          pasajeros: pasajeros,
          monto: total
        };      

        setObjPro(newObjPro);

        setLoading(false);
      } catch (error) {
        setError("Error al obtener los vuelos.");
        setLoading(false);
      }
    };

    fetchVuelosDetalle();
  }, [searchParams]);

  const handleRegresar = () => {
    router.back();
  };

  const handlePagar = async () => {
    setShowModal(false);
    setLoadingPay(true);
    if (objPro) {
      try {

        objPro.monto = total; 
        const response = await axios.post(
          "http://localhost:4000/orchestrator/proceso",          
            objPro,          
        );

        setLoadingPay(false);        

        if (response.data.response === "success") {
          
          const encryptedInfo = CryptoJS.AES.encrypt(JSON.stringify(response.data), "airlines").toString();
          router.push(`/boletoPasaje?data=${encodeURIComponent(encryptedInfo)}`);

        } else {
         
          setErrorMessage(response.data.message);
          setShowModalError(true);
        }
      } catch (error) {
        setLoadingPay(false);
        
        setErrorMessage(error);
        setShowModalError(true);
      }
    }
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

  if (loadingPay) {
    return (
      <div className={styles.loadingContainer}>
        <img src="/pay.gif" alt="Cargando..." className={styles.loadingGif} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.resumenContainer}>
      <h2 className={styles.h2}>Detalle de la compra</h2>
      <div className={styles.detalleCompra}>
        <div className={styles.detalleVuelo}>
          <h3 className={styles.h3}>IDA</h3>
          <p>
            {vuelos.ida.origen} ➜ {vuelos.ida.destino}
          </p>
          <p>{vuelos.ida.fecha}</p>
          <p>Subtotal: USD {vuelos.ida.subtotal}</p>
        </div>
        <div className={styles.detalleVuelo}>
          <h3 className={styles.h3}>VUELTA</h3>
          <p>
            {vuelos.vuelta.origen} ➜ {vuelos.vuelta.destino}
          </p>
          <p>{vuelos.vuelta.fecha}</p>
          <p>Subtotal: USD {vuelos.vuelta.subtotal}</p>
        </div>
        <div className={styles.detalleVuelo}>
          <h3 className={styles.h3}>Pasajeros</h3>
          <p>{vuelos.pasajero} persona(s)</p>
        </div>
        <div className={styles.detalleImpuestos}>
          <h3 className={styles.h3}>Tasas e impuestos</h3>
          <p>
            2 Tasa de Salida Aeroportuaria TUUA (Perú): USD{" "}
            {vuelos.impuestos.tasa.toFixed(2)}
          </p>
          <p>
            2 Impuesto por Ventas (Perú): USD{" "}
            {vuelos.impuestos.impsalida.toFixed(2)}
          </p>
          <p>
            <b>Subtotal:</b> USD {vuelos.impuestos.subtotal.toFixed(2)}
          </p>
        </div>
        <div className={styles.totalPagar}>
          <h3 className={styles.h2}>Total a pagar: USD {total.toFixed(2)}</h3>
        </div>
      </div>
      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.button} ${styles.regresarButton}`}
          onClick={handleRegresar}
        >
          Regresar
        </button>
        <button
          type="submit"
          className={styles.button}
          onClick={() => setShowModal(true)}
        >
          Pagar
        </button>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Confirmar Pago</h2>
            <p>¿Estás seguro de que deseas realizar el pago?</p>
            <button
              className={`${styles.button} ${styles.regresarButton}`}
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button className={styles.button} onClick={handlePagar}>
              Confirmar
            </button>
          </div>
        </div>
      )}

      {showModalError && (
              <div className={styles.modalError}>
                <div className={styles.modalErrorContent}>
                  <p>{errorMessage}</p>                  
                  <div><img src="/cancel.png" alt="error" /></div>
                  <button onClick={() => setShowModalError(false)}>Cerrar</button>
                </div>
              </div>
            )}
    </div>
  );
};

export default ResumenReserva;
