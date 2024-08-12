export async function fetchCiudades(query: string) {
  const response = await fetch(
    `http://localhost:3004/ciudades/buscar?q=${query}`
  );
  if (!response.ok) {
    throw new Error("Error al cargar las ciudades");
  }
  const data = await response.json();
  return data;
}
