"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "./resultadosVuelos.module.css"; 

const ResultadosVuelos = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [isVuelta, setIsVuelta] = useState(false);
  const [loadingVuelta, setLoadingVuelta] = useState(false);
  const [vueloSeleccionadoIda, setVueloSeleccionadoIda] = useState(null);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const origen = searchParams.get("origen");
    const destino = searchParams.get("destino");
    const ida = searchParams.get("ida");
    const vuelta = searchParams.get("vuelta");
    const pasajeros = searchParams.get("pasajeros");

    if (origen && destino && ida) {
      const fetchVuelos = async () => {
        try {
          const idaFormat = new Date(ida).toISOString().split("T")[0];

          const response = await axios.get(
            "http://localhost:3001/vuelos/buscar",
            {
              params: {
                origen,
                destino,
                fecha: idaFormat,
              },
            }
          );

          setVuelos(response.data);
          setLoading(false);
        } catch (error) {
          setError("Error al obtener los vuelos.");
          setLoading(false);
        }
      };

      fetchVuelos();
    }
  }, [searchParams]);

  const handleSeleccionarVueloIda = (vuelo) => {
    
    setVueloSeleccionadoIda(vuelo._id);
    setLoadingVuelta(true);

    const destino = searchParams.get("origen"); 
    const origen = searchParams.get("destino");
    const vuelta = searchParams.get("vuelta");

    const fetchVuelosVuelta = async () => {
      try {
        const vueltaFormat = new Date(vuelta).toISOString().split("T")[0];

        const response = await axios.get(
          "http://localhost:3001/vuelos/buscar",
          {
            params: {
              origen,
              destino,
              fecha: vueltaFormat,
            },
          }
        );

        setVuelos(response.data);
        setLoadingVuelta(false);
        setIsVuelta(true);
      } catch (error) {
        setError("Error al obtener los vuelos de vuelta.");
        setLoadingVuelta(false);
      }
    };

    fetchVuelosVuelta();
  };

  const handleSeleccionarVueloVuelta = (vueloVuelta) => {
    const pasajeros = searchParams.get("pasajeros");
   
    router.push(
      `/detallePasajeros?ida=${vueloSeleccionadoIda}&vuelta=${vueloVuelta._id}&pasajeros=${pasajeros}`
    );
  };


  const handleRegresarIda = () => {
    setIsVuelta(false);
    hasFetchedData.current = false;
    setVueloSeleccionado(null);
    window.location.reload(); 
  };

  if (loading || loadingVuelta) { 
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
    <div className={styles.contentContainer}>
      <h1>{isVuelta ? "Selecciona tu vuelo de vuelta" : "Selecciona tu vuelo de ida"}</h1>
      <br />
      {vuelos.length > 0 ? (
        <ul className={styles.vuelosList}>
          {vuelos.map((vuelo) => (
            <li
              key={vuelo.id}
              className={`${styles.vueloItem} ${
                vueloSeleccionado === vuelo.id ? styles.selected : ""
              }`}
              onClick={() => isVuelta
                ? handleSeleccionarVueloVuelta(vuelo)
                : handleSeleccionarVueloIda(vuelo)}
            >
              <div className={styles.vueloHeader}>
                <div className={styles.hora}>
                  <strong>{vuelo.horaSalida}</strong> {vuelo.origen}
                </div>
                <div className={styles.duracion}>
                  Duración <br />
                  {vuelo.duracion}
                </div>
                <div className={styles.hora}>
                  <strong>{vuelo.horaLlegada}</strong> {vuelo.destino}
                </div>
              </div>
              <div className={styles.vueloImg}>
                <img src="/avion.png" alt="avion" width={25} height={25} />
              </div>
              <div className={styles.vueloBody}>
                <div className={styles.operadoPor}>Operado por AirLines</div>
                <div className={styles.tipoVuelo}>Directo</div>
                <div className={styles.precio}>
                  Tarifa <strong>USD {vuelo.precio}</strong>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron vuelos para los criterios seleccionados.</p>
      )}
      {isVuelta && (
        <div className={styles.botonesContainer}>
          <button onClick={handleRegresarIda} className={styles.regresarBtn}>
            Regresar
          </button>         
        </div>
      )}
    </div>
  );
};

export default ResultadosVuelos;
