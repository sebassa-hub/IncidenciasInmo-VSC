import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

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

  const generarPDF = () => {
    // Cambiar a formato A4 con orientación horizontal para más espacio
    const doc = new jsPDF({
      orientation: 'portrait', // o 'landscape' si prefieres horizontal
      unit: 'mm',
      format: 'a4'
    });

    const limpiarTexto = (texto) => {
      if (!texto) return '';
      return texto
        .replace(/[^\x00-\x7F]/g, '')
        .replace(/Ã³/g, 'o')
        .replace(/Ã±/g, 'ñ')
        .replace(/Ã©/g, 'e')
        .replace(/Ã¡/g, 'a')
        .replace(/Ãº/g, 'u')
        .replace(/Ã­/g, 'i')
        .trim();
    };

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = 15;

    // Función auxiliar para agregar encabezado en cada página
    const agregarEncabezado = () => {
      // Fondo del encabezado
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Logo
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, 8, 18, 18, 3, 3, 'F');
      doc.setFontSize(16);
      doc.setTextColor(37, 99, 235);
      doc.setFont(undefined, 'bold');
      doc.text('II', margin + 9, 20, { align: 'center' });
      
      // Título principal
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('REPORTE DE INCIDENCIAS', margin + 22, 18);
      
      // Subtítulo
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.text('Inmobiliaria Inmo - Sistema de Gestión', margin + 22, 26);
    };

    // Función auxiliar para agregar pie de página
    const agregarPieDePagina = (numeroPagina) => {
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Página ${numeroPagina} | Generado el ${new Date().toLocaleDateString('es-PE', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    };

    // Primera página - Encabezado
    agregarEncabezado();
    yPosition = 45;

    // Información del reporte en tarjetas
    const cardWidth = (pageWidth - 2 * margin - 6) / 3;
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, yPosition, cardWidth, 30, 3, 3, 'F');
    doc.roundedRect(margin + cardWidth + 3, yPosition, cardWidth, 30, 3, 3, 'F');
    doc.roundedRect(margin + 2 * (cardWidth + 3), yPosition, cardWidth, 30, 3, 3, 'F');

    // Total de incidencias
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(datosFiltrados.length.toString(), margin + cardWidth / 2, yPosition + 15, { align: 'center' });
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Total Incidencias', margin + cardWidth / 2, yPosition + 24, { align: 'center' });

    // Pendientes
    const pendientes = datosFiltrados.filter(i => i.estado === 'Pendiente').length;
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(pendientes.toString(), margin + cardWidth + 3 + cardWidth / 2, yPosition + 15, { align: 'center' });
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Pendientes', margin + cardWidth + 3 + cardWidth / 2, yPosition + 24, { align: 'center' });

    // Resueltas
    const resueltas = datosFiltrados.filter(i => i.estado === 'Resuelto').length;
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(resueltas.toString(), margin + 2 * (cardWidth + 3) + cardWidth / 2, yPosition + 15, { align: 'center' });
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Resueltas', margin + 2 * (cardWidth + 3) + cardWidth / 2, yPosition + 24, { align: 'center' });

    yPosition += 40;

    // Línea decorativa
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Título de la sección
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Detalle de Incidencias', margin, yPosition);
    yPosition += 10;

    let numeroPagina = 1;

    // Iterar sobre las incidencias
    datosFiltrados.forEach((item, index) => {
      // Verificar espacio para nueva incidencia
      if (yPosition > pageHeight - 70) {
        agregarPieDePagina(numeroPagina);
        doc.addPage();
        numeroPagina++;
        agregarEncabezado();
        yPosition = 45;
      }

      // Tarjeta de incidencia con borde de color según estado
      let borderColor;
      if (item.estado === 'Pendiente') {
        borderColor = [239, 68, 68];
      } else if (item.estado === 'En Proceso') {
        borderColor = [234, 179, 8];
      } else {
        borderColor = [34, 197, 94];
      }

      // Altura dinámica de la tarjeta según descripción
      const descripcionCorta = item.descripcion.length > 150 
        ? item.descripcion.substring(0, 150) + '...' 
        : item.descripcion;
      const descripcionLines = doc.splitTextToSize(descripcionCorta, pageWidth - 2 * margin - 25);
      const cardHeight = 55 + (descripcionLines.length * 4);

      // Verificar de nuevo si cabe la tarjeta completa
      if (yPosition + cardHeight > pageHeight - 20) {
        agregarPieDePagina(numeroPagina);
        doc.addPage();
        numeroPagina++;
        agregarEncabezado();
        yPosition = 45;
      }

      // Borde izquierdo de color
      doc.setFillColor(...borderColor);
      doc.rect(margin, yPosition, 4, cardHeight, 'F');

      // Fondo de la tarjeta
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin + 4, yPosition, pageWidth - 2 * margin - 4, cardHeight, 2, 2, 'F');

      // Número de incidencia
      doc.setFillColor(...borderColor);
      doc.circle(margin + 18, yPosition + 10, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text((index + 1).toString(), margin + 18, yPosition + 12.5, { align: 'center' });

      // Título de la incidencia
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      const tituloCorto = item.titulo.length > 60 ? item.titulo.substring(0, 60) + '...' : item.titulo;
      doc.text(tituloCorto, margin + 30, yPosition + 12);

      yPosition += 20;

      // Grid de información con texto más grande
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      // Fila 1: Estado y Fecha
      doc.setTextColor(107, 114, 128);
      doc.text('Estado:', margin + 12, yPosition);
      doc.setTextColor(...borderColor);
      doc.setFont(undefined, 'bold');
      doc.text(item.estado, margin + 30, yPosition);

      doc.setTextColor(107, 114, 128);
      doc.setFont(undefined, 'normal');
      doc.text('Fecha:', margin + 90, yPosition);
      doc.setTextColor(31, 41, 55);
      doc.text(new Date(item.fecha_creacion).toLocaleDateString('es-PE'), margin + 110, yPosition);

      yPosition += 7;

      // Fila 2: Residente
      doc.setTextColor(107, 114, 128);
      doc.text('Residente:', margin + 12, yPosition);
      doc.setTextColor(31, 41, 55);
      doc.text(item.residente_nombre || 'N/A', margin + 35, yPosition);

      yPosition += 7;

      // Fila 3: Responsable
      doc.setTextColor(107, 114, 128);
      doc.text('Responsable:', margin + 12, yPosition);
      doc.setTextColor(31, 41, 55);
      const asignado = item.empleado_nombre 
        ? `Empleado: ${item.empleado_nombre}` 
        : item.empresa_proveedora_nombre 
          ? `Empresa: ${item.empresa_proveedora_nombre}` 
          : 'Sin asignar';
      doc.text(asignado, margin + 40, yPosition);

      yPosition += 10;

      // Descripción
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(9);
      doc.text('Descripcion:', margin + 12, yPosition);
      yPosition += 5;
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(9);
      doc.text(descripcionLines, margin + 12, yPosition);

      yPosition += descripcionLines.length * 4 + 12;
    });

    // Pie de página final
    agregarPieDePagina(numeroPagina);

    // Guardar
    doc.save(`Reporte_Incidencias_${new Date().toISOString().split('T')[0]}.pdf`);
  };


  const datosFiltrados = incidencias.filter((i) =>
    i.titulo.toLowerCase().includes(busqueda.toLowerCase())
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
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar incidencia por título..."
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
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
            
            {busqueda && (
              <p className="text-sm text-gray-500">
                Mostrando {datosFiltrados.length} de {incidencias.length} incidencias
              </p>
            )}

            <button
              onClick={generarPDF}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generar Reporte PDF
            </button>
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
                        // Modal de confirmación personalizado
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                        modal.innerHTML = `
                          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-bounce-in">
                            <div class="p-6 text-center">
                              <!-- Icono de advertencia -->
                              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                                </svg>
                              </div>
                              
                              <!-- Título y mensaje -->
                              <h3 class="text-xl font-bold text-gray-800 mb-2">¿Eliminar Incidencia?</h3>
                              <p class="text-gray-600 mb-4">Esta acción no se puede deshacer. La incidencia se eliminará permanentemente.</p>
                              
                              <!-- Detalles de la incidencia -->
                              <div class="bg-gray-50 rounded-lg p-3 mb-4 text-left">
                                <p class="text-sm text-gray-700"><span class="font-medium">Título:</span> ${item.titulo}</p>
                                <p class="text-sm text-gray-700"><span class="font-medium">Estado:</span> <span class="${estadoColor(item.estado).split(' ')[1]}">${item.estado}</span></p>
                              </div>

                              <!-- Botones de acción -->
                              <div class="flex gap-3">
                                <button id="cancelBtn" class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                  Cancelar
                                </button>
                                <button id="confirmBtn" class="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                                  Sí, Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        `;
                        
                        document.body.appendChild(modal);

                        // Agregar estilos para la animación
                        const style = document.createElement('style');
                        style.textContent = `
                          @keyframes bounce-in {
                            0% { opacity: 0; transform: scale(0.3); }
                            50% { opacity: 1; transform: scale(1.05); }
                            100% { opacity: 1; transform: scale(1); }
                          }
                          .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
                        `;
                        document.head.appendChild(style);

                        // Esperar a que el usuario confirme o cancele
                        const userConfirmed = await new Promise((resolve) => {
                          modal.querySelector('#confirmBtn').onclick = () => {
                            document.body.removeChild(modal);
                            document.head.removeChild(style);
                            resolve(true);
                          };
                          
                          modal.querySelector('#cancelBtn').onclick = () => {
                            document.body.removeChild(modal);
                            document.head.removeChild(style);
                            resolve(false);
                          };

                          // Cerrar al hacer clic fuera del modal
                          modal.onclick = (e) => {
                            if (e.target === modal) {
                              document.body.removeChild(modal);
                              document.head.removeChild(style);
                              resolve(false);
                            }
                          };
                        });

                        if (userConfirmed) {
                          try {
                            await axios.delete(`http://localhost:3002/api/incidencias/${item.id}`);
                            // Recargar la lista después de eliminar
                            const response = await axios.get('http://localhost:3002/api/incidencias');
                            setIncidencias(response.data.data || []);
                          } catch (error) {
                            console.error('Error al eliminar:', error);
                            alert('Error al eliminar la incidencia');
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