import styles from "./page.module.css";
import "./globals.css";
import BuscarVuelo from "./buscarVuelo";
import RootLayout from "./layout";

export default function Home() {   
  return (
      <div className={styles.container}>
        <BuscarVuelo />
      </div>    
  );
}
