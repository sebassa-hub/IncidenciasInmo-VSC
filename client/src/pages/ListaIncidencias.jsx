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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-6">
      {/* ENCABEZADO */}
      <header className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Gestión de Incidencias
            </h1>
            <p className="text-gray-500 text-sm">
              Administra y da seguimiento a todas las incidencias reportadas
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por título, descripción o estado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full lg:w-96 px-5 py-3 pl-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
            />
            <svg 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </header>

      {/* TABLA */}
      <div className="w-full max-w-7xl overflow-x-auto shadow-xl rounded-xl bg-white">
        <table className="w-full border-collapse min-w-max">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">Título</th>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">Estado</th>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">Residente</th>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">IDResidente</th>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">Asignado a</th>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">Fecha</th>
              <th className="py-3 px-4 text-left whitespace-nowrap font-semibold border-r border-blue-500 last:border-r-0">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length > 0 ? (
              datosFiltrados.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition-colors border-b-2 border-gray-300"
                >
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0 font-medium text-gray-700">{item.titulo}</td>
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${estadoColor(
                        item.estado
                      )}`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0">{item.residente_nombre}</td>
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0">{item.residente_id}</td>
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0">
                    {item.empleado_nombre ? (
                      <div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Empleado</span>
                        <div className="text-sm mt-1">{item.empleado_nombre}</div>
                      </div>
                    ) : item.empresa_proveedora_nombre ? (
                      <div>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Empresa</span>
                        <div className="text-sm mt-1">{item.empresa_proveedora_nombre}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Sin asignar</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0 text-gray-500">
                    {new Date(item.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300 last:border-r-0 flex justify-center gap-2">
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
      <footer className="mt-12 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Inmobiliaria Inmo — Todos los derechos reservados.
      </footer>
    </div>
  );
}