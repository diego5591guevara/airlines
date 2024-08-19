"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./boletoPasaje.module.css";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import ReactDOM from "react-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { useReactToPrint } from "react-to-print";

const BoletoPasaje = () => {
  const boletoRef = useRef();
  const searchParams = useSearchParams();
  const hasFetchedData = useRef(false);
  const mensaje = searchParams.get("mensaje");
  const router = useRouter();
  const encryptedPasajeros = searchParams.get("data");
  const [datosPasajeros, setDatosPasajeros] = useState([]);
  const [boletos, setBoletos] = useState([]);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const bytes = CryptoJS.AES.decrypt(encryptedPasajeros, "airlines");
    const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const boletosGenerados = data.pasajeros.map((pasajero) => {
      const vueloIda = data.origen.find(
        (vuelo) => vuelo._id === pasajero.origenId
      );
      const vueloVuelta = data.destino.find(
        (vuelo) => vuelo._id === pasajero.vueltaId
      );

      return {
        pasajero,
        ida: vueloIda,
        vuelta: vueloVuelta,
      };
    });

    setBoletos(boletosGenerados);
  }, []);

  const Boleto = ({ pasajero, vuelo, tipo }) => (
    <div id={`boleto-${tipo}`}>
      <div className={styles.ticket}>
        <div className={styles.ticketHeader}>
          <div className={styles.airlineName}>
            <img src="/AirLines.png" alt="logo" width={50} height={50} />
            <p>Air Lines - {tipo}</p>
          </div>
          <div className={styles.boardingPass}>BOARDING PASS</div>
        </div>
        <div className={styles.ticketBody}>
          <div className={styles.passengerInfo}>
            <div className={styles.infoLeft}>
              <div className={styles.label}>PASSENGER NAME</div>
              <div
                className={styles.value}
              >{`${pasajero.nombre} ${pasajero.apellido}`}</div>
              <div className={styles.label}>FROM</div>
              <div className={styles.value}>
                {vuelo.ciudadori} ({vuelo.origen})
              </div>
              <div className={styles.label}>TO</div>
              <div className={styles.value}>
                {vuelo.ciudadlle} ({vuelo.destino})
              </div>
            </div>
            <div className={styles.infoRight}>
              <div className={styles.label}>FLIGHT</div>
              <div className={styles.value}>{vuelo.avion}</div>
              <div className={styles.label}>DATE</div>
              <div className={styles.value}>{vuelo.fecha}</div>
              <div className={styles.label}>TIME</div>
              <div className={styles.value}>{vuelo.horaSalida}</div>
              <div className={styles.label}>GATE</div>
              <div className={styles.value}>--</div>
            </div>
            <div className={styles.infoQR}>
              <div className={styles.qr}>
                <img src="/qr-code.png" alt="qr" />
              </div>
            </div>
          </div>
          <div className={styles.barcode}></div>
        </div>
        <div className={styles.ticketFooter}>
          <div className={styles.note}>
            IMPORTANT NOTE: You should be at the boarding gate before departure
            time.
          </div>
        </div>
      </div>
    </div>
  );

  const handleVisualizarBoleto = () => {
    const input = document.getElementById("boleto");

    if (!input) {
      console.error("Elemento no encontrado");
      return;
    }

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const newWindow = window.open(pdfUrl, "_blank");
        if (newWindow) {
          newWindow.focus();
        } else {
          alert("Permita las ventanas emergentes para ver el PDF.");
        }
      })
      .catch((error) => {
        console.error("Error generating PDF", error);
      });
  };

  const handleImprimirBoleto = useReactToPrint({
    content: () => boletoRef.current,
  });

  const handleRegresarInicio = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.paymentDetailsContainer}>
        <h3>Detalles del Pago</h3>
        <div className={styles.paymentDetail}>
          <p>
            <strong>Método de Pago:</strong> Tarjeta de Crédito (Visa)
          </p>
          <p>
            <strong>Monto Total:</strong> USD 295.00
          </p>
          <p>
            <strong>Impuestos y Tarifas:</strong> USD 100.30
          </p>
          <p>
            <strong>Total Pagado:</strong> USD 395.30
          </p>
          <p>
            <strong>Fecha de Transacción:</strong> 18/08/2024
          </p>
          <p>
            <strong>Hora de Transacción:</strong> 21:35
          </p>
        </div>
        <button className={styles.sendReceiptButton}>
          Enviar constancia al correo
        </button>
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>¡Pago exitoso!</h1>
        <p className={styles.message}>
          {mensaje || "Tu compra se ha realizado con éxito."}
        </p>

        <div className={styles.links}>
          <button onClick={handleRegresarInicio} className={styles.buttonBack}>
            Regresar al Inicio
          </button>
          <button onClick={handleImprimirBoleto} className={styles.button}>
            Imprimir Boleto
          </button>
        </div>
        <br />
        <div ref={boletoRef}>
          {boletos.map(({ pasajero, ida, vuelta }, index) => (
            <div key={index} className={styles.pasajeroBoletos}>
              <h2 className={styles.tiutloNombre}>
                {`${pasajero.nombre} ${pasajero.apellido}`} - {pasajero.numero}
              </h2>
              <br />
              <Boleto pasajero={pasajero} vuelo={ida} tipo="Ida" />
              <br />
              <Boleto pasajero={pasajero} vuelo={vuelta} tipo="Vuelta" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoletoPasaje;
