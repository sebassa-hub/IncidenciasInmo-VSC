import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const [incidencias, setIncidencias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarIncidencias = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/incidencias");
        console.log('Respuesta del servidor:', response.data);
        const incidenciasData = response.data.data || [];
        setIncidencias(Array.isArray(incidenciasData) ? incidenciasData : []);
      } catch (error) {
        console.error("Error al cargar las incidencias:", error);
        setIncidencias([]); 
      }
    };
    cargarIncidencias();
  }, []);

  const estadoColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-red-100 text-red-700";
      case "En Proceso":
        return "bg-yellow-100 text-yellow-700";
      case "Resuelto":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const datosFiltrados = incidencias.filter((i) =>
    i.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    i.estado.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* ENCABEZADO */}
      <header className="w-full max-w-6xl flex flex-col sm:flex-row sm:justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          🧾 Lista de Incidencias
        </h1>
        <input
          type="text"
          placeholder="Buscar incidencia..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </header>

      {/* TABLA */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Título</th>
              <th className="py-3 px-4 text-left">Descripción</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Residente</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length > 0 ? (
              datosFiltrados.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-200"
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-700">{item.titulo}</td>
                  <td className="py-3 px-4 text-gray-600">{item.descripcion}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${estadoColor(
                        item.estado
                      )}`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.residente_nombre}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(item.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => navigate('/editar-incidencia', { state: { id: item.id } })}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={async () => {
                        if(window.confirm('¿Estás seguro de eliminar esta incidencia?')) {
                          try {
                            await axios.delete(`http://localhost:3002/api/incidencias/${item.id}`);
                            // Recargar la lista después de eliminar
                            const response = await axios.get('http://localhost:3002/api/incidencias');
                            setIncidencias(response.data.data || []);
                          } catch (error) {
                            console.error('Error al eliminar:', error);
                          }
                        }
                      }}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"  // Actualizado para coincidir con el número de columnas
                  className="text-center py-6 text-gray-500 italic"
                >
                  No se encontraron incidencias...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <footer className="mt-10 text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} Inmobiliaria Inmo — Todos los derechos reservados.
      </footer>
    </div>
  );
}