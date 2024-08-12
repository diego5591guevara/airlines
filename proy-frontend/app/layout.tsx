import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "AirLines",
  description: "Compra de boletos aéreos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className={styles.container}>
          <header className={styles.header}>
            <nav className={styles.nav}>
              <div className={styles.logo}>
                <img src="/AirLines.png" alt="AirLines Logo" />
              </div>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link href="/">Chek in</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/">Mis Viajes</Link>
                </li>
                <li className={styles.navItem}>
                  <Link href="/">Centro de ayuda</Link>
                </li>                
                <li className={styles.navItem}>
                  <Link href="/">Iniciar sesión</Link>
                </li>
              </ul>
            </nav>
          </header>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} AirLines</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
