"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "AirLines",
  description: "Compra de boletos aéreos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
                  <Link href="/">Check-in</Link>
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
              <div className={styles.actions}>
                <div className={styles.dropdown}>
                  <button
                    onClick={toggleDropdown}
                    className={styles.languageButton}
                  >
                    <img
                      src="/pais/peru.png"
                      alt="Perú"
                      className={styles.flagIcon}
                    />
                    Perú
                  </button>
                  {dropdownOpen && (
                    <ul className={styles.dropdownMenu}>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/argentina.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Argentina</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/brasil.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Brasil</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/chile.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Chile</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/colombia.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Colombia</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/estados-unidos.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>EE.UU</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/ecuador.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Ecuador</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/paraguay.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Paraguay</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/peru.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Perú</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/">
                          <img
                            src="/pais/uruguay.png"
                            alt="Perú"
                            className={styles.flagIcon}
                          />
                          <span>Uruguay</span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </nav>
          </header>
          <main className={styles.main}>{children}</main>
          <footer className={styles.footer}>
            <p>
              &copy; 2024 AirLines | <a href="#">Política de Privacidad</a> |{" "}
              <a href="#">Términos de Uso</a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
