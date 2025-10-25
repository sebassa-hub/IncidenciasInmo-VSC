import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegistroIncidencias() {
    const navigate = useNavigate();
    
    // Obtener el usuario logueado desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Incluir el residente_id automáticamente desde el usuario logueado
            const dataToSend = {
                ...formData,
                residente_id: user.idPropietario
            };

            const response = await axios.post('http://localhost:3002/api/incidencias', dataToSend);
            
            if (response.data.success) {
                // Mostrar modal de éxito
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error("Error al crear la incidencia:", error);
            alert('❌ ' + (error.response?.data?.error || "Error al crear la incidencia. Por favor, intente de nuevo."));
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        // Limpiar el formulario después de cerrar el modal
        setFormData({
            titulo: "",
            descripcion: ""
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-6">
            {/* Header */}
            <header className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            <span className="text-xl">←</span>
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Registrar Nueva Incidencia
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Hola {user.nombre}, reporta tu incidencia aquí
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Form */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Información de la Incidencia</h2>
                    </div>

                    {/* Título */}
                    <div>
                        <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">
                            Título de la Incidencia *
                        </label>
                        <input
                            type="text"
                            id="titulo"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Ej: Fuga de agua en baño principal"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción Detallada *
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            rows="6"
                            value={formData.descripcion}
                            onChange={handleChange}
                            placeholder="Describe detalladamente el problema..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                            required
                        ></textarea>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({ titulo: "", descripcion: "" });
                            }}
                            className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Limpiar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registrando...
                                </>
                            ) : (
                                'Registrar Incidencia'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal de Éxito */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-bounce-in">
                        <div className="p-8 text-center">
                            {/* Icono de éxito */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            
                            {/* Título */}
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                ¡Incidencia Registrada!
                            </h3>
                            
                            {/* Mensaje */}
                            <p className="text-gray-600 mb-2">
                                Tu incidencia ha sido registrada exitosamente.
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                El administrador revisará tu solicitud pronto.
                            </p>

                            {/* Detalles de la incidencia */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                <h4 className="font-semibold text-gray-700 mb-2">Resumen:</h4>
                                <p className="text-sm text-gray-600"><span className="font-medium">Título:</span> {formData.titulo}</p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Estado:</span> <span className="text-yellow-600">Pendiente</span></p>
                                <p className="text-sm text-gray-600"><span className="font-medium">Fecha:</span> {new Date().toLocaleDateString()}</p>
                            </div>

                            {/* Botón de acción */}
                            <button
                                onClick={handleCloseSuccessModal}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
                            >
                                Registrar Otra Incidencia
                            </button>
                            
                            {/* Opción para salir */}
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full mt-3 text-gray-600 py-2 rounded-lg font-medium hover:text-gray-800 transition-colors"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="mt-8 text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} Inmobiliaria Inmo — Todos los derechos reservados.
            </footer>

            {/* Estilos para animaciones */}
            <style jsx>{`
                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}