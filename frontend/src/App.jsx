import { useState, useEffect } from 'react';
import './app.css';

function App() {
  const [mascota, setMascota] = useState(null);

  // GET simple al backend
  useEffect(() => {
    fetch('http://localhost:3000/pets/name/Winona')
      .then(response => response.json())
      .then(data => setMascota(data.data))
      .catch(error => {
        setMascota({name: 'Error al conectar', error});
      });
  }, []);

  if (mascota === null) {
    return <h1>Cargando...</h1>
  }

  return (
    <div>
      <h1>Detalles de tu mascota</h1>
      <p>{mascota.name}</p>
    </div>
  )
}

export default App
