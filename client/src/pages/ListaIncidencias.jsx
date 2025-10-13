import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const incidencias = [
    {
      id: 1,
      area: "Piscina",
      descripcion: "Fuga de agua en la bomba principal",
      urgencia: "Inmediata",
      prioridad: "Alta",
      estado: "Pendiente",
      responsable: "Carlos López",
      fecha: "2025-10-10",
    },
    {
      id: 2,
      area: "Ascensor",
      descripcion: "Ruido extraño al subir",
      urgencia: "Normal",
      prioridad: "Media",
      estado: "En Proceso",
      responsable: "María Torres",
      fecha: "2025-10-09",
    },
    {
      id: 3,
      area: "Lobby",
      descripcion: "Luz quemada en la entrada",
      urgencia: "Programada",
      prioridad: "Baja",
      estado: "Resuelto",
      responsable: "Sin asignar",
      fecha: "2025-10-08",
    },
  ];

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
    i.area.toLowerCase().includes(busqueda.toLowerCase()) ||
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
              <th className="py-3 px-4 text-left">Área</th>
              <th className="py-3 px-4 text-left">Descripción</th>
              <th className="py-3 px-4 text-left">Urgencia</th>
              <th className="py-3 px-4 text-left">Prioridad</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-left">Responsable</th>
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
                  <td className="py-3 px-4 font-medium text-gray-700">{item.area}</td>
                  <td className="py-3 px-4 text-gray-600">{item.descripcion}</td>
                  <td className="py-3 px-4">{item.urgencia}</td>
                  <td className="py-3 px-4">{item.prioridad}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${estadoColor(
                        item.estado
                      )}`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4">{item.responsable}</td>
                  <td className="py-3 px-4 text-gray-500">{item.fecha}</td>
                  <td className="py-3 px-4 flex justify-center gap-2">
                    <button
                      onClick={() => navigate('/editar', { state: { id: item.id } })}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 font-medium rounded-lg hover:bg-yellow-200 transition"
                    >
                      Editar
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
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