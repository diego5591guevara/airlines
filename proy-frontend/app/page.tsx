"use client";

import React from "react";
import styles from "./page.module.css";
import BuscarVuelo from "./buscarVuelo";
import Carousel from "./Carousel";

export default function Home() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.content}>
          <h1>Encuentra tu vuelo ideal</h1>
          <p>Descubre las mejores ofertas y vuela al mejor precio</p>
          <BuscarVuelo />
        </div>
      </div>

      <div className={styles.carouselContainer}>
        <Carousel>
          <img
            src="/carousel/img1.jpg"
            alt="Imagen 1"
            className={styles.carouselImage}
          />
          <img
            src="/carousel/img3.jpg"
            alt="Imagen 2"
            className={styles.carouselImage}
          />
          <img
            src="/carousel/img5.jpg"
            alt="Imagen 3"
            className={styles.carouselImage}
          />
        </Carousel>
      </div>

      <div className={styles.pageContent}>
        <h2>Ofertas Especiales</h2>
        <p>Explora nuestras ofertas exclusivas para diferentes destinos.</p>
        <button className={styles.ctaButton}>Ver Ofertas</button>
      </div>      
    </>
  );
}
