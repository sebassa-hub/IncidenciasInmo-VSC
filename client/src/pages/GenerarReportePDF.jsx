import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GenerarReportePDF = ({ incidencias, filtro }) => {
    const generarPDF = async () => {
        try {
            // Crear nuevo PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            // Título del reporte
            pdf.setFontSize(20);
            pdf.setTextColor(40, 40, 40);
            pdf.text('Reporte de Incidencias', 105, 20, { align: 'center' });
            
            // Fecha de generación
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generado el: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
            
            // Filtro aplicado (si existe)
            if (filtro) {
                pdf.text(`Filtro: "${filtro}"`, 105, 36, { align: 'center' });
            }
            
            // Estadísticas
            const pendientes = incidencias.filter(i => i.estado === 'Pendiente').length;
            const enProceso = incidencias.filter(i => i.estado === 'En Proceso').length;
            const resueltas = incidencias.filter(i => i.estado === 'Resuelto').length;
            
            pdf.setFontSize(12);
            pdf.setTextColor(40, 40, 40);
            pdf.text(`Total: ${incidencias.length} incidencias`, 20, 50);
            pdf.text(`Pendientes: ${pendientes}`, 20, 58);
            pdf.text(`En Proceso: ${enProceso}`, 20, 66);
            pdf.text(`Resueltas: ${resueltas}`, 20, 74);
            
            // Encabezados de la tabla
            let yPos = 90;
            pdf.setFillColor(59, 130, 246); // Azul
            pdf.rect(20, yPos, 170, 10, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(10);
            pdf.text('Título', 25, yPos + 7);
            pdf.text('Estado', 80, yPos + 7);
            pdf.text('Residente', 110, yPos + 7);
            pdf.text('Asignado a', 140, yPos + 7);
            pdf.text('Fecha', 170, yPos + 7);
            
            // Contenido de la tabla
            yPos += 15;
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);
            
            incidencias.forEach((incidencia, index) => {
                if (yPos > 270) { // Nueva página si se llena
                    pdf.addPage();
                    yPos = 20;
                }
                
                // Color de fondo alternado
                if (index % 2 === 0) {
                    pdf.setFillColor(245, 245, 245);
                    pdf.rect(20, yPos - 5, 170, 8, 'F');
                }
                
                // Título (truncado si es muy largo)
                const titulo = incidencia.titulo.length > 30 ? 
                    incidencia.titulo.substring(0, 30) + '...' : incidencia.titulo;
                pdf.text(titulo, 25, yPos);
                
                // Estado con color
                const estadoColor = getEstadoColor(incidencia.estado);
                pdf.setTextColor(estadoColor.r, estadoColor.g, estadoColor.b);
                pdf.text(incidencia.estado, 80, yPos);
                pdf.setTextColor(0, 0, 0);
                
                // Residente
                const residente = incidencia.residente_nombre || 'N/A';
                pdf.text(residente, 110, yPos);
                
                // Asignado a
                let asignado = 'Sin asignar';
                if (incidencia.empleado_nombre) {
                    asignado = incidencia.empleado_nombre;
                } else if (incidencia.empresa_proveedora_nombre) {
                    asignado = incidencia.empresa_proveedora_nombre;
                }
                pdf.text(asignado, 140, yPos);
                
                // Fecha
                const fecha = new Date(incidencia.fecha_creacion).toLocaleDateString();
                pdf.text(fecha, 170, yPos);
                
                yPos += 10;
            });
            
            // Pie de página
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Página ${i} de ${pageCount}`, 105, 287, { align: 'center' });
            }
            
            // Descargar PDF
            pdf.save(`reporte-incidencias-${new Date().toISOString().split('T')[0]}.pdf`);
            
        } catch (error) {
            console.error('Error al generar PDF:', error);
            alert('Error al generar el reporte PDF');
        }
    };
    
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Pendiente': return { r: 239, g: 68, b: 68 }; // Rojo
            case 'En Proceso': return { r: 245, g: 158, b: 11 }; // Amarillo
            case 'Resuelto': return { r: 34, g: 197, b: 94 }; // Verde
            default: return { r: 100, g: 100, b: 100 }; // Gris
        }
    };
    
    return (
        <button
            onClick={generarPDF}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Generar PDF
        </button>
    );
};

export default GenerarReportePDF;